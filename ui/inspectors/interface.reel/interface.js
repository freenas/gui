var Component = require("montage/ui/component").Component,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType,
    Model = require("core/model/model").Model;

/**
 * @class Interface
 * @extends Component
 */
exports.Interface = Component.specialize({

    _object: {
        value: null
    },

    dhcpAlias: {
        value: null
    },

    staticIP: {
        value: null
    },

    otherAliases: {
        value: null
    },

    ipAddressSource: {
        value: null
    },

    constructor: {
        value: function() {
            this.super();
            this.dhcpAlias =
                {address: "",
                 netmask: null,
                 type: "INET" };
        }
    },

    save: {
        value: function() {
            this.application.dataService.saveDataObject(this.object);
        }
    },

    object: {
        set: function (networkInterface) {
            this._object = networkInterface;

            if (networkInterface && networkInterface.type === NetworkInterfaceType.ETHER) {
                this._object = networkInterface;

                if (networkInterface) {
                    if (networkInterface.dhcp) {
                        this.ipAddressSource = "dhcp";
                        // The first and only ipv4 address in the read-only aliases is
                        // always the one assigned by dhcp if dhcp is enabled.
                        // Otherwise the one pre-set in the inspector applies.
                        for (var i = 0, length = networkInterface.status.aliases.length; i < length; i++) {
                            if (networkInterface.status.aliases[i].type === "INET") {
                                this.dhcpAlias = networkInterface.status.aliases[i];
                                break;
                            }
                        }
                    } else {
                        this.ipAddressSource = "static";
                    }
                    // This always applies, in case they switch off DHCP
                    this.staticIP = networkInterface.aliases.slice(0, 1);
                    this.otherAliases = networkInterface.aliases.slice(1);
                }
            }
        },

        get: function () {
            var newObject = new Object(this._object);

            if (this.staticIP) {
                newObject.aliases = this.staticIP.concat(this.otherAliases).filter(function (alias) { return !!alias; });
            }

            return newObject;
        }
    }

});
