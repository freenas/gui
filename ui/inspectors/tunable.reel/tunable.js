/**
 * @module ui/tunable.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    TunableType = require("core/model/enumerations/tunable-type").TunableType;

/**
 * @class Tunable
 * @extends Component
 */
exports.Tunable = Component.specialize(/** @lends Tunable# */ {
    typeOptions: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this.typeOptions = TunableType.members;
            }
            if (!!this.object._isNew) {
                if (!this.object.type) {
                    this.object.type = "LOADER";
                }
            }
        }
    }
});
