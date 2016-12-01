var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    NetworkRepository = require("core/repository/network-repository").NetworkRepository,
    SystemRepository = require("core/repository/system-repository").SystemRepository,
    NetworkInterfaceAliasType = require("core/model/enumerations/network-interface-alias-type").NetworkInterfaceAliasType,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType,
    Model = require("core/model/model").Model;

exports.NetworkSectionService = AbstractSectionService.specialize({
    init: {
        value: function(networkRepository, systemRepository) {
            this._networkRepository = networkRepository || NetworkRepository.instance;
            this._systemRepository = systemRepository || SystemRepository.instance;
        }
    },

    loadEntries: {
        value: function() {
            return this._networkRepository.listNetworkInterfaces();
        }
    },

    __ipmiServices: {
        value: null
    },

    _ipmiServices: {
        get: function() {
            return this.__ipmiServices || (this.__ipmiServices = Model.populateObjectPrototypeForType(Model.Ipmi).then(function (Ipmi) {
                return Ipmi.constructor.services;
            }));
        }
    },

    _isIpmiLoaded: {
        value: function() {
            return this._ipmiServices.then(function(ipmiServices) {
                return ipmiServices.isIpmiLoaded();
            });
        }
    },

    loadExtraEntries: {
        value: function() {
            var self = this;
            return this._isIpmiLoaded().then(function(isIpmiLoaded) {
                if (isIpmiLoaded) {
                    return Promise.all([
                        self._networkRepository.listIpmiChannels()
                    ]);
                }
            });
        }
    },

    loadOverview: {
        value: function() {
            var self = this;
            return this._networkRepository.getNetworkOverview().then(function(overview) {
                return self._systemRepository.getGeneral().then(function(general) {
                    overview.system = general;
                    return overview;
                });
            });
        }
    },

    loadSettings: {
        value: function() {
            var self = this;
            return this._networkRepository.getNetworkSettings().then(function(settings) {
                return self._systemRepository.getGeneral().then(function(general) {
                    settings.system = general;
                    return settings;
                });
            });
        }
    },

    revertSettings: {
        value: function() {
            var self = this;
            return this._networkRepository.revertNetworkSettings().then(function() {
                return self._systemRepository.revertSystemGeneral();
            });
        }
    },

    saveSettings: {
        value: function() {
            return Promise.all([
                this._networkRepository.saveNetworkSettings(),
                this._systemRepository.saveSystemGeneral()
            ]);
        }
    },

    initializeInterface: {
        value: function(interface) {
            interface._interfaces = this.entries;
            interface._otherAliases = [];
            interface._ipAddress = null;
            interface._ipv6Address = null;
            if (interface.dhcp) {
                interface._dhcpAliases = interface.status.aliases;
                var alias;
                for (var i = 0, length = interface.status.aliases.length; i < length; i++) {
                    alias = interface.status.aliases[i];
                    if (alias.type === NetworkInterfaceAliasType.INET) {
                        interface._dhcpAddress = interface._ipAddress = alias;
                        break;
                    }
                }
                for (var j = 0, len = interface.status.aliases.length; j < len; j++) {
                    alias = interface.status.aliases[j];
                    if (alias.type === NetworkInterfaceAliasType.INET6) {
                        interface._ipv6Address = alias;
                        break;
                    }
                }
            } else {
                this._splitAliasesOnInterface(interface);
            }
            if (interface._ipv6Address === null) {
                interface._ipv6Address = {};
            }
        }
    },

    handleDhcpChangeOnInterface: {
        value: function(interface) {
            if (interface.dhcp) {
                interface._ipAddress = interface._dhcpAddress;
            } else if (!interface.aliases) {
                interface._ipAddress = null;
                interface._ipv6Address = null;
                interface.aliases = [];
            }
            return !interface.dhcp;
        }
    },

    saveInterface: {
        value: function(interface) {
            this._flattenAliasesOnInterface(interface);
            if (interface.type === NetworkInterfaceType.VLAN) {
                this._cleanupVlanInterface(interface);
            }
            return this._networkRepository.saveNetworkInterface(interface);
        }
    },

    loadStaticRoutes: {
        value: function() {
            return this._networkRepository.listNetworkStaticRoutes();
        }
    },

    getNewStaticRoute: {
        value: function() {
            return this._networkRepository.getNewNetworkStaticRoute();
        }
    },

    saveStaticRoute: {
        value: function(route) {
            return this._networkRepository.saveNetworkStaticRoute(route);
        }
    },

    deleteStaticRoute: {
        value: function(route) {
            return this._networkRepository.deleteNetworkStaticRoute(route);
        }
    },

    loadHosts: {
        value: function() {
            return this._networkRepository.listNetworkHosts();
        }
    },

    getNewHost: {
        value: function() {
            return this._networkRepository.getNewNetworkHost();
        }
    },

    saveHost: {
        value: function(host) {
            return this._networkRepository.saveNetworkHost(host);
        }
    },

    deleteHost: {
        value: function(host) {
            return this._networkRepository.deleteNetworkHost(host);
        }
    },

    renewLease: {
        value: function() {
            var self = this;

            return this._networkRepository.listNetworkInterfaces().then(function(interfaces) {
                var promises = [];

                for (var i = 0; i < interfaces.length; i++) {
                    var interface = interfaces[i];
                    if (interface.dhcp) {
                        promises.push(interface.services.renew(interface.id));
                    }
                }

                return Promise.all(promises);
            });
        }
    },

    _cleanupVlanInterface: {
        value: function(interface) {
            if (typeof interface.vlan.tag !== 'number') {
                interface.vlan = {
                    tag: null,
                    parent: null
                };
            }
        }
    },

    _flattenAliasesOnInterface: {
        value: function(interface) {
            if (!interface.dhcp) {
                var aliases = [];
                if (typeof interface._ipAddress === 'object' && !!interface._ipAddress.address && !!interface._ipAddress.netmask) {
                    interface._ipAddress.type = NetworkInterfaceAliasType.INET;
                    aliases.push(interface._ipAddress);
                }
                if (typeof interface._ipv6Address === 'object' && !!interface._ipv6Address.address && !!interface._ipv6Address.netmask) {
                    interface._ipv6Address.type = NetworkInterfaceAliasType.INET6;
                    aliases.push(interface._ipv6Address);
                }
                interface.aliases = aliases.concat(interface._otherAliases);
                this._splitAliasesOnInterface(interface);
            }
        }
    },

    _splitAliasesOnInterface: {
        value: function(interface) {
            var alias;
            interface._otherAliases = [];
            interface._ipAddress = null;
            interface._ipv6Address = null;
            for (var i = 0, length = interface.aliases.length; i < length; i++) {
                alias = interface.aliases[i];
                if (alias.type === NetworkInterfaceAliasType.INET && interface._ipAddress === null) {
                    interface._ipAddress = alias;
                } else if (alias.type === NetworkInterfaceAliasType.INET6 && interface._ipv6Address === null) {
                    interface._ipv6Address = alias;
                } else {
                    interface._otherAliases.push(alias);
                }
            }
            if (!interface._ipAddress) {
                interface._ipAddress = {};
            }
            if (!interface._ipv6Address) {
                interface._ipv6Address = {};
            }
        }
    }
});
