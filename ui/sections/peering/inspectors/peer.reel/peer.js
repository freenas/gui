/**
 * @module ui/sections/peering/inspectors/peer.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Peer
 * @extends Component
 */
exports.Peer = AbstractInspector.specialize(/** @lends Peer# */ {

    enterDocument: {
        value: function () {
            if (!this.object._action && !this.object._isNew) {
                this.object._action = 'creation';
            }
        }
    },

    save: {
        value: function() {
            if (this.object.type === 'freenas') {
                this.inspector.save({username: this.object.username, password: this.object.password});
            }else {
                this.inspector.save();
            }
        }
    }
});
