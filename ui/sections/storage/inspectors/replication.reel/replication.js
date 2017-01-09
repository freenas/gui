/**
 * @module ui/replication.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Replication
 * @extends AbstractInspector
 */
exports.Replication = AbstractInspector.specialize(/** @lends Replication# */ {
    constructor: {
        value: function Replication() {
            this.super();
        }
    }
});
