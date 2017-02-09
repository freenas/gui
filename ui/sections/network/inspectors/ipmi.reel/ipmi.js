/**
 * @module ui/ipmi.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Ipmi
 * @extends Component
 */
exports.Ipmi = AbstractInspector.specialize(/** @lends Ipmi# */ {

    save: {
        value: function() {
            if (this.object && !this.object.dhcp && !!this.object.address) {
                this.object.netmask = this.object.netmask || 24;
            }
            return this.inspector.save();
        }
    }
});
