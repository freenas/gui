var Component = require("montage/ui/component").Component,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType,
    Model = require("core/model/model").Model;

/**
 * @class Vlan
 * @extends Component
 */
exports.Vlan = Component.specialize({

    _object: {
        value: null
    },

    ipWithNetmaskConverter: {
        value: {
            convert: function(value) {
                var alias = {label: value.label, value:{}};
                var splitValue = value.label.split("/");

                alias.value.address = splitValue[0];

                // These needs to be checked based on if the address is IPv4 or IPv6
                alias.value.netmask = parseInt(splitValue[1], 10);
                alias.value.type = "INET"
                return alias;
            },
            validator: {
                validate: function(value) {
                    // This function needs to check if the string value is
                    // a valid ip address/netmask combination (ipv4 or ipv6)
                    return true;
                }
            }
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

                        self.parentOptions = parentOptions;
                    });

                    // Convert aliases for multiple select
                    var _aliasOption;
                    this.aliasOptions = [];

                    for (var i = 0, length = networkInterface.aliases.length; i < length; i++ ) {
                        _aliasOption = { value: networkInterface.aliases[i] };
                        _aliasOption.label = _aliasOption.value.address + "/" + _aliasOption.value.netmask;
                        this.aliasOptions.push( _aliasOption );
                    }
                }
            } else {
                this._object = null;
            }
        },
        get: function () {
            return this._object;
        }
    },

    parentOptions: {
        value: null
    },

    aliasOptions: {
        value: null
    }

});
