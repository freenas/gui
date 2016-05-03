/**
 * @module ui/snapshot.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Snapshot
 * @extends Component
 */
exports.Snapshot = Component.specialize(/** @lends Snapshot# */ {
    lifetime: {
        get: function() {
            return this.object.lifetime;
        },
        set: function(lifetime) {
            if (this.object) {
                if (lifetime && lifetime.length > 0) {
                    this.object.lifetime = +lifetime;
                } else {
                    this.object.lifetime = null
                }
            }
        }
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object != object) {
                this._object = object;
                if (object.id == void 0) {
                    this._object.replicable = true;
                }
            }
        }
    }
});
