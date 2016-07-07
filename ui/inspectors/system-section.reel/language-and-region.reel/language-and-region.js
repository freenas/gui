/**
 * @module ui/language-and-region.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model

/**
 * @class LanguageAndRegion
 * @extends Component
 */
exports.LanguageAndRegion = Component.specialize(/** @lends LanguageAndRegion# */ {
    constructor: {
        value: function LanguageAndRegion() {
            this.super();
        }
    },

    timezoneOptions: {
        value: null
    },


    _getTimezones: {
        value: function() {
            var self = this;
            return Model.populateObjectPrototypeForType(Model.SystemGeneral).then(function(SystemGeneral) {
                return SystemGeneral.constructor.services.timezones();
            }).then(function(timezones) {
                self.timezoneOptions = self.timezones = timezones;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this._getTimezones();
        }
    }
});
