"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_section_service_ng_1 = require("./abstract-section-service-ng");
var network_repository_1 = require("../../repository/network-repository");
var system_repository_1 = require("../../repository/system-repository");
var model_1 = require("core/model/model");
var network_interface_alias_type_1 = require("../../model/enumerations/network-interface-alias-type");
var network_interface_type_1 = require("../../model/enumerations/network-interface-type");
var Promise = require("bluebird");
var NetworkSectionService = (function (_super) {
    __extends(NetworkSectionService, _super);
    function NetworkSectionService() {
        _super.apply(this, arguments);
        this.INTERFACE_TYPES = network_repository_1.NetworkRepository.INTERFACE_TYPES;
    }
    NetworkSectionService.prototype.init = function () {
        this.networkRepository = network_repository_1.NetworkRepository.getInstance();
        this.systemRepository = system_repository_1.SystemRepository.getInstance();
    };
    NetworkSectionService.prototype.loadEntries = function () {
        return this.networkRepository.listNetworkInterfaces();
    };
    NetworkSectionService.prototype.loadExtraEntries = function () {
        var self = this;
        return this.isIpmiLoaded().then(function (isIpmiLoaded) {
            if (isIpmiLoaded) {
                return Promise.all([
                    self.networkRepository.listIpmiChannels()
                ]);
            }
        });
    };
    NetworkSectionService.prototype.loadSettings = function () {
        return Promise.all([
            this.networkRepository.getNetworkSettings(),
            this.systemRepository.getGeneral()
        ]).spread(function (settings, general) {
            settings.system = general;
            return settings;
        });
    };
    NetworkSectionService.prototype.loadOverview = function () {
        return Promise.all([
            this.networkRepository.getNetworkOverview(),
            this.systemRepository.getGeneral()
        ]).spread(function (overview, general) {
            overview.system = general;
            return overview;
        });
    };
    NetworkSectionService.prototype.saveSettings = function () {
        return Promise.all([
            this.networkRepository.saveNetworkSettings(),
            this.systemRepository.saveGeneral()
        ]);
    };
    NetworkSectionService.prototype.getNewInterfaceWithType = function (interfaceType) {
        return this.networkRepository.getNewInterfaceWithType(interfaceType);
    };
    NetworkSectionService.prototype.initializeInterface = function (networkInterface) {
        var alias;
        networkInterface._networkInterfaces = this.entries;
        networkInterface._otherAliases = [];
        networkInterface._ipAddress = null;
        networkInterface._ipv6Address = null;
        if (networkInterface.dhcp) {
            networkInterface._dhcpAliases = networkInterface.status.aliases;
            for (var i = 0, length_1 = networkInterface.status.aliases.length; i < length_1; i++) {
                alias = networkInterface.status.aliases[i];
                if (alias.type === network_interface_alias_type_1.NetworkInterfaceAliasType.INET) {
                    networkInterface._dhcpAddress = networkInterface._ipAddress = alias;
                    break;
                }
            }
            for (var j = 0, len = networkInterface.status.aliases.length; j < len; j++) {
                alias = networkInterface.status.aliases[j];
                if (alias.type === network_interface_alias_type_1.NetworkInterfaceAliasType.INET6) {
                    networkInterface._ipv6Address = alias;
                    break;
                }
            }
        }
        else {
            this.splitAliasesOnInterface(networkInterface);
        }
        if (networkInterface._ipv6Address === null) {
            networkInterface._ipv6Address = {};
        }
    };
    NetworkSectionService.prototype.getNewNetworkInterface = function () {
        return this.networkRepository.getNewNetworkInterface();
    };
    NetworkSectionService.prototype.handleDhcpChangeOnInterface = function (networkInterface) {
        if (networkInterface.dhcp) {
            networkInterface._ipAddress = networkInterface._dhcpAddress;
        }
        else if (!networkInterface.aliases) {
            networkInterface._ipAddress = null;
            networkInterface._ipv6Address = null;
            networkInterface.aliases = [];
        }
        return !networkInterface.dhcp;
    };
    NetworkSectionService.prototype.saveInterface = function (networkInterface) {
        this.flattenAliasesOnInterface(networkInterface);
        if (networkInterface.type === network_interface_type_1.NetworkInterfaceType.VLAN) {
            this.cleanupVlanInterface(networkInterface);
        }
        return this.networkRepository.saveNetworkInterface(networkInterface);
    };
    NetworkSectionService.prototype.loadStaticRoutes = function () {
        return this.networkRepository.listNetworkStaticRoutes();
    };
    NetworkSectionService.prototype.getNewStaticRoute = function () {
        return this.networkRepository.getNewNetworkStaticRoute();
    };
    NetworkSectionService.prototype.saveStaticRoute = function (route) {
        return this.networkRepository.saveNetworkStaticRoute(route);
    };
    NetworkSectionService.prototype.deleteStaticRoute = function (route) {
        return this.networkRepository.deleteNetworkStaticRoute(route);
    };
    NetworkSectionService.prototype.loadHosts = function () {
        return this.networkRepository.listNetworkHosts();
    };
    NetworkSectionService.prototype.getNewHost = function () {
        return this.networkRepository.getNewNetworkHost();
    };
    NetworkSectionService.prototype.saveHost = function (host) {
        return this.networkRepository.saveNetworkHost(host);
    };
    NetworkSectionService.prototype.deleteHost = function (host) {
        return this.networkRepository.deleteNetworkHost(host);
    };
    NetworkSectionService.prototype.renewLease = function () {
        var self = this, promises, i, networkInterface;
        return this.networkRepository.listNetworkInterfaces().then(function (interfaces) {
            promises = [];
            for (i = 0; i < interfaces.length; i++) {
                networkInterface = interfaces[i];
                if (networkInterface.dhcp) {
                    promises.push(networkInterface.services.renew(networkInterface.id));
                }
            }
            return Promise.all(promises);
        });
    };
    NetworkSectionService.prototype.cleanupVlanInterface = function (networkInterface) {
        if (typeof networkInterface.vlan.tag !== "number") {
            networkInterface.vlan = {
                tag: null,
                parent: null
            };
        }
    };
    NetworkSectionService.prototype.flattenAliasesOnInterface = function (networkInterface) {
        var aliases = [];
        if (!networkInterface.dhcp) {
            if (typeof networkInterface._ipAddress === "object" && !!networkInterface._ipAddress.address && !!networkInterface._ipAddress.netmask) {
                networkInterface._ipAddress.type = network_interface_alias_type_1.NetworkInterfaceAliasType.INET;
                aliases.push(networkInterface._ipAddress);
            }
            if (typeof networkInterface._ipv6Address === "object" && !!networkInterface._ipv6Address.address && !!networkInterface._ipv6Address.netmask) {
                networkInterface._ipv6Address.type = network_interface_alias_type_1.NetworkInterfaceAliasType.INET6;
                aliases.push(networkInterface._ipv6Address);
            }
            networkInterface.aliases = aliases.concat(networkInterface._otherAliases);
            this.splitAliasesOnInterface(networkInterface);
        }
    };
    NetworkSectionService.prototype.splitAliasesOnInterface = function (networkInterface) {
        var alias, i;
        networkInterface._otherAliases = [];
        networkInterface._ipAddress = null;
        networkInterface._ipv6Address = null;
        for (i = 0, length = networkInterface.aliases.length; i < length; i++) {
            alias = networkInterface.aliases[i];
            if (alias.type === network_interface_alias_type_1.NetworkInterfaceAliasType.INET && networkInterface._ipAddress === null) {
                networkInterface._ipAddress = alias;
            }
            else if (alias.type === network_interface_alias_type_1.NetworkInterfaceAliasType.INET6 && networkInterface._ipv6Address === null) {
                networkInterface._ipv6Address = alias;
            }
            else {
                networkInterface._otherAliases.push(alias);
            }
        }
        if (!networkInterface._ipAddress) {
            networkInterface._ipAddress = {};
        }
        if (!networkInterface._ipv6Address) {
            networkInterface._ipv6Address = {};
        }
    };
    NetworkSectionService.prototype.isIpmiLoaded = function () {
        return (this.ipmiServicesPromise || (this.ipmiServicesPromise = model_1.Model.populateObjectPrototypeForType(model_1.Model.Ipmi).then(function (Ipmi) { return Ipmi.constructor.services; })))
            .then(function (ipmiServices) { return ipmiServices.isIpmiLoaded(); });
    };
    return NetworkSectionService;
}(abstract_section_service_ng_1.AbstractSectionService));
exports.NetworkSectionService = NetworkSectionService;
