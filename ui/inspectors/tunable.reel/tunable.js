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
    templateDidLoad: {
        value: function() {
            this.typeOptions = TunableType.members;
        }
    },
    enterDocument: {
        value: function(isFirstTime) {
            if (!!this.object._isNew && !this.object.type) {
                this.object.type = "LOADER";
            }
        }
    }
});
