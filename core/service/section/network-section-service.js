var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    NetworkRepository = require("core/repository/network-repository").NetworkRepository,
    NetworkInterfaceAliasType = require("core/model/enumerations/network-interface-alias-type").NetworkInterfaceAliasType;

exports.NetworkSectionService = AbstractSectionService.specialize({
    init: {
        value: function(networkRepository) {
            this._networkRepository = networkRepository || NetworkRepository.instance;
        }
    },

    listEntries: {
        value: function() {
            var self = this;
            return this._networkRepository.listNetworkInterfaces().then(function(interfaces) {
                return self.entries = interfaces;
            });
        }
    },

    initializeInterface: {
        value: function(interface) {
            interface._interfaces = this.entries;
            interface._otherAliases = [];
            interface._ipAddress = null;
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
            } else {
                this._splitAliasesOnInterface(interface);
            }
        }
    },

    handleDhcpChangeOnInterface: {
        value: function(interface) {
            if (interface.dhcp) {
                interface._ipAddress = interface._dhcpAddress;
            } else if (!interface.aliases) {
                interface._ipAddress = null;
                interface.aliases = [];
            }
            return !interface.dhcp;
        }
    },

    saveInterface: {
        value: function(interface) {
            this._flattenAliasesOnInterface(interface);
            return this._networkRepository.saveNetworkInterface(interface);
        }
    },

    _flattenAliasesOnInterface: {
        value: function(interface) {
            if (!interface.dhcp) {
                if (interface._ipAddress && typeof interface._ipAddress === 'object') {
                    interface.aliases = [interface._ipAddress].concat(interface._otherAliases);
                } else {
                    interface.aliases = interface._otherAliases;
                }
                this._splitAliasesOnInterface(interface);
            }
        }
    },

    _splitAliasesOnInterface: {
        value: function(interface) {
            interface._ipAddress = interface.aliases[0];
            interface._otherAliases = interface.aliases.slice(1);
        }
    }
});
