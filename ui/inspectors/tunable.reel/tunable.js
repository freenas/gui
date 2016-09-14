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
    typeOPTIONS: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                tunableType = TunableType;
            if (isFirstTime) {
                this.typeOPTIONS = [];
                for (var i = 0; i < tunableType.members.length; i++) {
                    this.typeOPTIONS.push({label: tunableType.members[i], value: tunableType[tunableType.members[i]]});
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
