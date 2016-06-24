var Montage = require("montage/core/core").Montage;

/**
 * @class AbstractModel
 * @extends Montage
 */
exports.AbstractModel = Montage.specialize({

    _blueprint: {
        value: null
    },

    //FIXME: need to be removed when migration from blueprint to "compiled" models will be done.
    blueprint: {
        get: function () {
            if (!this._blueprint) {
                this._blueprint = {
                    propertyBlueprints: this.constructor.propertyBlueprints
                }
            }

            return this._blueprint;
        }
    }

});
