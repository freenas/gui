/**
 * @module ui/ipmi.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Ipmi
 * @extends Component
 */
exports.Ipmi = AbstractInspector.specialize(/** @lends Ipmi# */ {

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
