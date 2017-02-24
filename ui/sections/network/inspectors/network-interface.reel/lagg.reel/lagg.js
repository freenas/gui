var Component = require("montage/ui/component").Component,
    NetworkAggregationProtocols = require("core/model/enumerations/NetworkAggregationProtocols").NetworkAggregationProtocols;

/**
 * @class Lagg
 * @extends Component
 */
exports.Lagg = Component.specialize({
    laggProtocolOptions: {
        value: NetworkAggregationProtocols.members
    }
});
