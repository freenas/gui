var Component = require("montage/ui/component").Component,
    NetworkAggregationProtocols = require("core/model/enumerations/network-aggregation-protocols").NetworkAggregationProtocols,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType,
    Model = require("core/model/model").Model;

/**
 * @class Lagg
 * @extends Component
 */
var Lagg = exports.Lagg = Component.specialize({

    _object: {
        value: null
    },

    object: {
        set: function (networkInterface) {
            if (networkInterface && networkInterface.type === NetworkInterfaceType.LAGG) {
                this._object = networkInterface;

                if (networkInterface) {
                    var self = this;

                    //FIXME: when move to FetchDataWithCriteria when it will have been implemented.
                    this.application.dataService.fetchData(Model.NetworkInterface).then(function (networkInterfaces) {
                        var portOptions = [],
                            _networkInterface;

                        for (var i = 0, length = networkInterfaces.length; i < length; i++) {
                            _networkInterface = networkInterfaces[i];

                            if (_networkInterface.type === NetworkInterfaceType.ETHER) {
                                portOptions.push(_networkInterface);
                            }
                        }

                        self.portOptions = portOptions;
                    });
                }
            } else {
                this._object = null;
            }
        },
        get: function () {
            return this._object;
        }
    },

    laggProtocolOptions: {
        value: NetworkAggregationProtocols.members
    },

    portOptions: {
        value: null
    }

});
