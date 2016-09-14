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
            var self = this,
                EnumTunableType = TunableType;
            if (isFirstTime) {
                this.typeOptions = [];
                for (var i = 0; i < EnumTunableType.members.length; i++) {
                    this.typeOptions.push(EnumTunableType.members[i]);
                }
            }
            if (!!this.object._isNew) {
                if (!this.object.type) {
                    this.object.type = "LOADER";
                }
            }
        }
    }
});
