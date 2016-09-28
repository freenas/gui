var Component = require("montage/ui/component").Component,
    NetworkAggregationProtocols = require("core/model/enumerations/network-aggregation-protocols").NetworkAggregationProtocols;

/**
 * @class Lagg
 * @extends Component
 */
exports.Lagg = Component.specialize({
    laggProtocolOptions: {
        value: NetworkAggregationProtocols.members
    }
});
