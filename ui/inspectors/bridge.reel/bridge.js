var Component = require("montage/ui/component").Component,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType,
    Model = require("core/model/model").Model;

/**
 * @class Bridge
 * @extends Component
 */
var Bridge = exports.Bridge = Component.specialize({

    _object: {
        value: null
    },

    object: {
        set: function (networkInterface) {
            if (networkInterface && networkInterface.type === NetworkInterfaceType.BRIDGE) {
                this._object = networkInterface;
                this._object.staticIP = [networkInterface.aliases[0]];
                this._object.otherAliases = networkInterface.aliases.slice(1);

                if (networkInterface) {

                    // Filter member options
                    //FIXME: when move to FetchDataWithCriteria when it will have been implemented.
                    this.application.dataService.fetchData(Model.NetworkInterface).then(function (networkInterfaces) {
                        var memberOptions = [],
                            _networkInterface;

                        for (var i = 0, length = networkInterfaces.length; i < length; i++) {
                            _networkInterface = networkInterfaces[i];

                            if (_networkInterface.type === NetworkInterfaceType.ETHER) {
                                memberOptions.push(_networkInterface);
                            }
                        }

                        this.memberOptions = memberOptions;
                    }.bind(this));
                }

                // Convert aliases for multiple select
                var _aliasOption;
                this.aliasOptions = [];

                for (var i = 0, length = networkInterface.aliases.length; i < length; i++ ) {
                    _aliasOption = { value: networkInterface.aliases[i] };
                    _aliasOption.label = _aliasOption.value.address + "/" + _aliasOption.value.netmask;
                    this.aliasOptions.push( _aliasOption );
                }
            } else {
                this._object = null;
            }
        },
        get: function () {
            return this._object;
        }
    },

    memberOptions: {
        value: null
    },

    aliasOptions: {
        value: null
    }

});
