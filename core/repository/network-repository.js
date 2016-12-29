"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var model_event_name_1 = require("../model-event-name");
var network_interface_dao_1 = require("../dao/network-interface-dao");
var network_config_dao_1 = require("../dao/network-config-dao");
var network_route_dao_1 = require("../dao/network-route-dao");
var network_host_dao_1 = require("../dao/network-host-dao");
var ipmi_dao_1 = require("../dao/ipmi-dao");
var Promise = require("bluebird");
var NetworkRepository = (function (_super) {
    __extends(NetworkRepository, _super);
    function NetworkRepository(networkInterfaceDao, networkRouteDao, networkHostDao, networkConfigDao, ipmiDao) {
        _super.call(this, [
            'NetworkInterface'
        ]);
        this.networkInterfaceDao = networkInterfaceDao;
        this.networkRouteDao = networkRouteDao;
        this.networkHostDao = networkHostDao;
        this.networkConfigDao = networkConfigDao;
        this.ipmiDao = ipmiDao;
    }
    NetworkRepository.getInstance = function () {
        if (!NetworkRepository.instance) {
            NetworkRepository.instance = new NetworkRepository(new network_interface_dao_1.NetworkInterfaceDao(), new network_route_dao_1.NetworkRouteDao(), new network_host_dao_1.NetworkHostDao(), new network_config_dao_1.NetworkConfigDao(), new ipmi_dao_1.IpmiDao());
        }
        return NetworkRepository.instance;
    };
    NetworkRepository.prototype.listNetworkInterfaces = function () {
        return this.networkInterfaceDao.list();
    };
    NetworkRepository.prototype.saveNetworkInterface = function (networkInterface) {
        return this.networkInterfaceDao.save(networkInterface);
    };
    NetworkRepository.prototype.getNewNetworkInterface = function () {
        return this.networkInterfaceDao.getNewInstance();
    };
    NetworkRepository.prototype.getNewInterfaceWithType = function (interfaceType) {
        return Promise.all([
            this.networkInterfaceDao.getNewInstance(),
            this.modelDescriptorService.getDaoForType(interfaceType.properties.objectType).then(function (dao) {
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
    };
    NetworkRepository.prototype.listNetworkStaticRoutes = function () {
        return this.networkRouteDao.list();
    };
    NetworkRepository.prototype.getNewNetworkStaticRoute = function () {
        return this.networkRouteDao.getNewInstance();
    };
    NetworkRepository.prototype.saveNetworkStaticRoute = function (route) {
        return this.networkRouteDao.save(route);
    };
    NetworkRepository.prototype.deleteNetworkStaticRoute = function (route) {
        return this.networkRouteDao.delete(route);
    };
    NetworkRepository.prototype.listNetworkHosts = function () {
        return this.networkHostDao.list();
    };
    NetworkRepository.prototype.getNewNetworkHost = function () {
        return this.networkHostDao.getNewInstance();
    };
    NetworkRepository.prototype.saveNetworkHost = function (host) {
        return this.networkHostDao.save(host);
    };
    NetworkRepository.prototype.deleteNetworkHost = function (host) {
        return this.networkHostDao.delete(host);
    };
    NetworkRepository.prototype.listIpmiChannels = function () {
        return this._IpmiChannelPromise || (this._IpmiChannelPromise = this.ipmiDao.list());
    };
    NetworkRepository.prototype.getNetworkOverview = function () {
        var self = this;
        return Promise.all([
            this.networkInterfaceDao.list(),
            this.networkConfigDao.get()
        ]).spread(function (interfaces, config) { return ({
            interfaces: interfaces,
            config: config
        }); });
    };
    NetworkRepository.prototype.getNetworkSettings = function () {
        var self = this;
        this._networkSettings = {};
        return this.networkConfigDao.get().then(function (config) {
            self._networkSettings.config = config;
            return self._networkSettings;
        });
    };
    NetworkRepository.prototype.revertNetworkSettings = function () {
        return this.networkConfigDao.revert(this._networkSettings.config);
    };
    NetworkRepository.prototype.saveNetworkSettings = function () {
        return this.networkConfigDao.save(this._networkSettings.config);
    };
    NetworkRepository.prototype.getMyIps = function () {
        return this.networkConfigDao.getMyIps();
    };
    NetworkRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'NetworkInterface':
                this.interfaces = this.dispatchModelEvents(this.interfaces, model_event_name_1.ModelEventName.NetworkInterface, state);
                break;
            default:
                break;
        }
    };
    NetworkRepository.prototype.handleEvent = function (name, data) {
    };
    NetworkRepository.INTERFACE_TYPES = {
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
    return NetworkRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.NetworkRepository = NetworkRepository;
