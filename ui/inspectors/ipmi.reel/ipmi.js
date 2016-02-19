/**
 * @module ui/ipmi.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Ipmi
 * @extends Component
 */
exports.Ipmi = Component.specialize(/** @lends Ipmi# */ {

    _object: {
        value: null
    },

    object: {
        set: function (ipmiConfig) {
            if ( ipmiConfig ) {
                this._object = ipmiConfig;
            } else {
                this._object = null;
            }
        },

        get: function () {
            return this._object;
        }
    }
});
