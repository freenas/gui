/**
 * @module ui/sections/peering/inspectors/peer.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Peer
 * @extends Component
 */
exports.Peer = Component.specialize(/** @lends Peer# */ {
    enterDocument: {
        value: function() {
            if (this.object && this.object._isNew) {
                this.application.peeringService.populateDefaultType(this.object);
            }
        }
    },

    save: {
        value: function() {
            if (this.credentialsComponent && typeof this.credentialsComponent.save === "function") {
                this.credentialsComponent.save();
            }
            this.inspectorComponent.save();
        }
    }
});
