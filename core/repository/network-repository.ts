import {AbstractRepository} from "./abstract-repository-ng";
import {ModelEventName} from "../model-event-name";
import {NetworkInterfaceDao} from "../dao/network-interface-dao";
import {NetworkConfigDao} from "../dao/network-config-dao";
import {NetworkRouteDao} from "../dao/network-route-dao";
import {NetworkHostDao} from "../dao/network-host-dao";
import {IpmiDao} from "../dao/ipmi-dao";
import {Map} from "immutable";
import * as Promise from "bluebird";

export class NetworkRepository extends AbstractRepository {
    private static instance: NetworkRepository;

    private interfaces: Map<string, Map<string, any>>;

    public static readonly INTERFACE_TYPES = {
        VLAN: {
            type: 'vlan',
            label: 'VLAN',
            properties: {
                objectType: 'NetworkInterfaceVlanProperties',
                type: "network-interface-vlan-properties"
            }
        },
        LAGG: {
            type: 'lagg',
            label: 'LAGG',
            properties: {
                objectType: 'NetworkInterfaceLaggProperties',
                type: 'network-interface-lagg-properties'
            }
        },
        BRIDGE: {
            type: 'bridge',
            label: 'BRIDGE',
            properties: {
                objectType: 'NetworkInterfaceBridgeProperties',
                type: 'network-interface-bridge-properties'
            }
        }
    };

    public constructor(private networkInterfaceDao: NetworkInterfaceDao,
                       private networkRouteDao: NetworkRouteDao,
                       private networkHostDao: NetworkHostDao,
                       private networkConfigDao: NetworkConfigDao,
                       private ipmiDao: IpmiDao) {
        super([
            'NetworkInterface'
        ]);
    }

    public static getInstance() {
        if (!NetworkRepository.instance) {
            NetworkRepository.instance = new NetworkRepository(
                new NetworkInterfaceDao(),
                new NetworkRouteDao(),
                new NetworkHostDao(),
                new NetworkConfigDao(),
                new IpmiDao()
            );
        }
        return NetworkRepository.instance;
    }

    public listNetworkInterfaces() {
        return this.networkInterfaceDao.list();
    }

    public saveNetworkInterface(networkInterface) {
        return this.networkInterfaceDao.save(networkInterface);
    }

    public getNewNetworkInterface() {
        return this.networkInterfaceDao.getNewInstance();
    }

    public getNewInterfaceWithType(interfaceType) {
        return Promise.all([
            this.networkInterfaceDao.getNewInstance(),
            this.modelDescriptorService.getDaoForType(interfaceType.properties.objectType).then(function(dao) {
                return dao.getNewInstance();
            })
        ]).spread(function (newInterface, properties) {
            newInterface._isNewObject = true;
            newInterface._tmpId = interfaceType.type;
            newInterface.type = interfaceType.type.toUpperCase();
            newInterface.aliases = [];
            newInterface.name = "";
            newInterface[interfaceType.type] = properties;
            return newInterface;
        });
    }

    public listNetworkStaticRoutes() {
        return this.networkRouteDao.list();
    }

    public getNewNetworkStaticRoute() {
        return this.networkRouteDao.getNewInstance();
    }

    public saveNetworkStaticRoute(route) {
        return this.networkRouteDao.save(route);
    }

    public deleteNetworkStaticRoute(route) {
        return this.networkRouteDao.delete(route);
    }

    public listNetworkHosts() {
        return this.networkHostDao.list();
    }

    public getNewNetworkHost() {
        return this.networkHostDao.getNewInstance();
    }

    public saveNetworkHost(host) {
        return this.networkHostDao.save(host);
    }

    public deleteNetworkHost(host) {
        return this.networkHostDao.delete(host);
    }

    public listIpmiChannels() {
        return this._IpmiChannelPromise || (this._IpmiChannelPromise = this.ipmiDao.list());
    }

    public getNetworkOverview() {
        let self = this;
        return Promise.all([
            this.networkInterfaceDao.list(),
            this.networkConfigDao.get()
        ]).spread((interfaces, config) => ({
            interfaces,
            config
        }));
    }

    public getNetworkSettings() {
        let self = this;
        this._networkSettings = {};
        return this.networkConfigDao.get().then(config => {
            self._networkSettings.config = config;
            return self._networkSettings;
        });
    }

    public revertNetworkSettings() {
        return this.networkConfigDao.revert(this._networkSettings.config);
    }

    public saveNetworkSettings() {
        return this.networkConfigDao.save(this._networkSettings.config);
    }

    public getMyIps() {
        return this.networkConfigDao.getMyIps();
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'NetworkInterface':
                this.interfaces = this.dispatchModelEvents(this.interfaces, ModelEventName.NetworkInterface, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }

}
