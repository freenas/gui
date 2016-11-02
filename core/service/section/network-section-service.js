var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    NetworkRepository = require("core/repository/network-repository").NetworkRepository,
    SystemRepository = require("core/repository/system-repository").SystemRepository,
    NetworkInterfaceAliasType = require("core/model/enumerations/network-interface-alias-type").NetworkInterfaceAliasType,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType;

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

    loadOverview: {
        value: function() {
            var self = this;
            return this._networkRepository.getNetworkOverview().then(function(overview) {
                return self._systemRepository.getSystemGeneral().then(function(general) {
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
                return self._systemRepository.getSystemGeneral().then(function(general) {
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
                if (interface._ipAddress && typeof interface._ipAddress === 'object') {
                    if (interface._ipv6Address && typeof interface._ipv6Address == 'object') {
                        interface._ipv6Address.type = NetworkInterfaceAliasType.INET6;
                        interface.aliases = [interface._ipAddress, interface._ipv6Address].concat(interface._otherAliases);
                    } else {
                        interface.aliases = [interface._ipAddress].concat(interface._otherAliases);
                    }
                } else {
                    interface.aliases = interface._otherAliases;
                }
                this._splitAliasesOnInterface(interface);
            }
        }
    },

    _splitAliasesOnInterface: {
        value: function(interface) {
            var alias;
            for (var i = 0, length = interface.aliases.length; i < length; i++) {
                alias = interface.aliases[i];
                if (alias.type === NetworkInterfaceAliasType.INET && interface._ipAddress === null) {
                    interface._ipAddress = alias;
                }
                else if (alias.type === NetworkInterfaceAliasType.INET6 && interface._ipv6Address === null) {
                    interface._ipv6Address = alias;
                } else {
                    interface._otherAliases.push(alias);
                }
            }
        }
    }
});
