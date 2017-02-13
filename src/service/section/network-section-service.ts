import {AbstractSectionService} from './abstract-section-service-ng';
import {NetworkRepository} from '../../repository/network-repository';
import {SystemRepository} from '../../repository/system-repository';
import {NetworkInterfaceAliasType} from '../../model/enumerations/NetworkInterfaceAliasType';
import {NetworkInterfaceType} from '../../model/enumerations/NetworkInterfaceType';
import * as _ from 'lodash';
import {NetworkInterfaceRepository} from '../../repository/NetworkInterfaceRepository';
import {ModelEventName} from '../../model-event-name';
import {Map} from 'immutable';

export class NetworkSectionService extends AbstractSectionService {

    public readonly INTERFACE_TYPES = NetworkRepository.INTERFACE_TYPES;

    public readonly IPV4_DEFAULT_NETMASK = 24;
    public readonly IPV6_DEFAULT_NETMASK = 64;

    private networkRepository: NetworkRepository;
    private networkInterfaceRepository: NetworkInterfaceRepository;
    private systemRepository: SystemRepository;

    private ipmiServicesPromise: Promise<any>;

    protected init() {
        this.networkRepository = NetworkRepository.getInstance();
        this.networkInterfaceRepository = NetworkInterfaceRepository.getInstance();
        this.systemRepository = SystemRepository.getInstance();
    }

    protected loadEntries() {
        return this.networkInterfaceRepository.list().then(entries => {
            this.eventDispatcherService.addEventListener(ModelEventName.NetworkInterface.listChange, this.handleEntriesChange.bind(this));
            return entries;
        });
    }

    protected loadExtraEntries() {
        let self = this;
        return this.isIpmiLoaded().then(isIpmiLoaded => {
            if (isIpmiLoaded) {
                return Promise.all([
                    self.networkRepository.listIpmiChannels()
                ]);
            }
        });
    }

    protected loadSettings() {
        return Promise.all([
            this.networkRepository.getNetworkSettings(),
            this.systemRepository.getGeneral()
        ]).spread((settings: any, general) => {
            settings.system = general;
            return settings;
        });
    }

    protected loadOverview() {
        return Promise.all([
            this.networkRepository.getNetworkOverview(),
            this.systemRepository.getGeneral()
        ]).spread((overview: any, general) => {
            overview.system = general;
            return overview;
        });
    }

    public saveSettings(settings: any) {
        return this.networkRepository.saveNetworkSettings(settings.config).then(
            (task) => task.taskPromise
        ).then(
            () => this.systemRepository.saveGeneral(settings.system)
        );
    }

    public getNewInterfaceWithType(interfaceType: any) {
        return this.networkInterfaceRepository.getNewInterfaceWithType(interfaceType);
    }

    public initializeInterface(networkInterface: any) {
        let alias;

        networkInterface._networkInterfaces = this.entries;
        networkInterface._otherAliases = [];
        networkInterface._ipAddress = null;
        networkInterface._ipv6Address = null;
        if (networkInterface.dhcp) {
            networkInterface._dhcpAliases = networkInterface.status.aliases;
            for (let i = 0, length = networkInterface.status.aliases.length; i < length; i++) {
                alias = networkInterface.status.aliases[i];
                if (alias.type === NetworkInterfaceAliasType.INET) {
                    networkInterface._dhcpAddress = networkInterface._ipAddress = alias;
                    break;
                }
            }
            for (let j = 0, len = networkInterface.status.aliases.length; j < len; j++) {
                alias = networkInterface.status.aliases[j];
                if (alias.type === NetworkInterfaceAliasType.INET6) {
                    networkInterface._ipv6Address = alias;
                    break;
                }
            }
        } else {
            this.splitAliasesOnInterface(networkInterface);
        }
        if (networkInterface._ipv6Address === null) {
            networkInterface._ipv6Address = {};
        }
    }

    public getNewNetworkInterface() {
        return this.networkInterfaceRepository.getNewInstance();
    }

    public handleDhcpChangeOnInterface(networkInterface: any) {
        if (networkInterface.dhcp) {
            networkInterface._ipAddress = networkInterface._dhcpAddress;
        } else if (!networkInterface.aliases) {
            networkInterface._ipAddress = null;
            networkInterface._ipv6Address = null;
            networkInterface.aliases = [];
        }
        return !networkInterface.dhcp;
    }

    public saveInterface(networkInterface: any) {
        this.flattenAliasesOnInterface(networkInterface);
        if (networkInterface.type === NetworkInterfaceType.VLAN) {
            this.cleanupVlanInterface(networkInterface);
        }
        return this.networkInterfaceRepository.save(networkInterface);
    }

    public loadStaticRoutes() {
        return this.networkRepository.listNetworkStaticRoutes();
    }

    public getNewStaticRoute() {
        return this.networkRepository.getNewNetworkStaticRoute();
    }

    public saveStaticRoute(route: any) {
        return this.networkRepository.saveNetworkStaticRoute(route);
    }

    public deleteStaticRoute(route: any) {
        return this.networkRepository.deleteNetworkStaticRoute(route);
    }

    public loadHosts() {
        return this.networkRepository.listNetworkHosts();
    }

    public getNewHost() {
        return this.networkRepository.getNewNetworkHost();
    }

    public saveHost(host: any) {
        return this.networkRepository.saveNetworkHost(host);
    }

    public deleteHost(host: any) {
        return this.networkRepository.deleteNetworkHost(host);
    }

    public renewLease() {
        return this.networkInterfaceRepository.list().then(interfaces => {
            return Promise.all(
                _.compact(_.map(interfaces, nic => nic.dhcp ? this.networkInterfaceRepository.renew(nic) : null)));
        });
    }

    private cleanupVlanInterface(networkInterface: any) {
        if (typeof networkInterface.vlan.tag !== 'number') {
            networkInterface.vlan = {
                tag: null,
                parent: null
            };
        }
    }

    private flattenAliasesOnInterface(networkInterface: any) {
        let aliases = [];

        if (!networkInterface.dhcp) {
            if (networkInterface._ipAddress && typeof networkInterface._ipAddress === 'object' && !!networkInterface._ipAddress.address) {
                networkInterface._ipAddress.type = NetworkInterfaceAliasType.INET;
                networkInterface._ipAddress.netmask = networkInterface._ipAddress.netmask || this.IPV4_DEFAULT_NETMASK;
                aliases.push(networkInterface._ipAddress);
            }
            if (networkInterface._ipv6Address && typeof networkInterface._ipv6Address === 'object' && !!networkInterface._ipv6Address.address) {
                networkInterface._ipv6Address.type = NetworkInterfaceAliasType.INET6;
                networkInterface._ipv6Address.netmask = networkInterface._ipv6Address.netmask || this.IPV6_DEFAULT_NETMASK;
                aliases.push(networkInterface._ipv6Address);
            }
            networkInterface.aliases = aliases.concat(networkInterface._otherAliases);
            this.splitAliasesOnInterface(networkInterface);
        } else {
            delete networkInterface.aliases;
        }
    }

    private splitAliasesOnInterface(networkInterface: any) {
        let alias, i;

        networkInterface._otherAliases = [];
        networkInterface._ipAddress = null;
        networkInterface._ipv6Address = null;
        for (i = 0, length = networkInterface.aliases.length; i < length; i++) {
            alias = networkInterface.aliases[i];
            _.unset(alias, 'broadcast');
            if (alias.type === NetworkInterfaceAliasType.INET && networkInterface._ipAddress === null) {
                networkInterface._ipAddress = alias;
            } else if (alias.type === NetworkInterfaceAliasType.INET6 && networkInterface._ipv6Address === null) {
                networkInterface._ipv6Address = alias;
            } else {
                networkInterface._otherAliases.push(alias);
            }
        }
        if (!networkInterface._ipAddress) {
            networkInterface._ipAddress = {};
        }
        if (!networkInterface._ipv6Address) {
            networkInterface._ipv6Address = {};
        }
    }

    private isIpmiLoaded() {
        return this.networkRepository.isIpmiLoaded();
    }

    private handleEntriesChange(state: Map<string, Map<string, any>>) {
        this.dataObjectChangeService.handleDataChange(this.entries, state);
    }
}
