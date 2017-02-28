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
            this.systemRepository.getGeneral(),
            this.networkRepository.listNetworkHosts(),
            this.networkRepository.listNetworkStaticRoutes()
        ]).spread((settings: any, general: any, hosts: Array<any>, routes: Array<any>) => {
            settings.system = general;
            settings.hosts = hosts;
            settings.routes = routes;
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

    public getNextSequenceForStream(streamId: string) {}

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
        }
        if (networkInterface._ipv6Address === null) {
            networkInterface._ipv6Address = {};
        }
        return this.networkRepository.isClientInterface(networkInterface).then(isClient => networkInterface._isClient = isClient);
    }

    public getNewNetworkInterface(type) {
        return this.networkInterfaceRepository.getNewInterfaceWithType(type);
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

    private isIpmiLoaded() {
        return this.networkRepository.isIpmiLoaded();
    }

    private handleEntriesChange(state: Map<string, Map<string, any>>) {
        this.dataObjectChangeService.handleDataChange(this.entries, state);
    }
}
