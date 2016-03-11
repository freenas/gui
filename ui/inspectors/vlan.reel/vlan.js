var Component = require("montage/ui/component").Component,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType,
    Model = require("core/model/model").Model,
    Converter = require("montage/core/converter/converter").Converter,
    Validator = require("montage/core/converter/converter").Validator;

/**
 * @class Vlan
 * @extends Component
 */
exports.Vlan = Component.specialize({

    _object: {
        value: null
    },

    parentOptions: {
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

    vlanTagConverter: {
        value: null
    },

    constructor: {
        value: function() {
            this.super();
            this.dhcpAlias =
                {address: "",
                 netmask: null,
                 type: "INET" };
            this.vlanTagConverter = new VlanTagConverter();
        }
    },

    save: {
        value: function() {
            this.application.dataService.saveDataObject(this.object);
        }
    },

    delete: {
        value: function() {
            this.application.dataService.deleteDataObject(this.object);
        }
    },

    object: {
        set: function (networkInterface) {
            if (networkInterface && networkInterface.type === NetworkInterfaceType.VLAN) {
                this._object = networkInterface;

                if (networkInterface) {

                    //Filter parent options
                    //FIXME: when move to FetchDataWithCriteria when it will have been implemented.
                    this.application.dataService.fetchData(Model.NetworkInterface).then(function (networkInterfaces) {
                        var parentOptions = [],
                            _networkInterface;

                        for (var i = 0, length = networkInterfaces.length; i < length; i++) {
                            _networkInterface = networkInterfaces[i];

                            if (_networkInterface.type === NetworkInterfaceType.LAGG ||
                                _networkInterface.type === NetworkInterfaceType.ETHER) {

                                parentOptions.push(_networkInterface);
                            }
                        }
                        this.parentOptions = parentOptions;
                    }.bind(this));

                    if (networkInterface.dhcp) {
                        this.ipAddressSource = "dhcp";
                        // The first and only ipv4 address in the read-only aliases is
                        // always the one assigned by dhcp if dhcp is enabled.
                        // Otherwise the one pre-set in the inspector applies.
                        for (var i = 0, length = networkInterface.status.aliases.length; i < length; i++ ) {
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
            } else {
                this._object = null;
            }
        },
        get: function () {
            return this._object;
        }
    }
});

var VlanTagConverter = Converter.specialize({

    constructor: {
        value: function() {
            this.super();
            this.validator = new VlanTagValidator();
        }
    },

    // This is only needed because convert is mandatory. Revert and validate
    // matter more here.
    convert: {
        value: function (vlanTag) {
            return vlanTag;
        }
    },

    revert: {
        value: function (tagInput) {
            var result;
            if (this.validator.validate(tagInput)) {
                result = parseInt(tagInput, 10);
            } else {
                result = tagInput;
            }
            return result;
        }
    }
});

var VlanTagValidator = Validator.specialize({
    validate: {
        value: function (tagValue) {
            var result = parseInt(tagValue);
            if (/^\d+$/.test(tagValue) && result >=1 && result <= 4095) {
                return true;
            } else {
                return false;
            }
        }
    }
});
