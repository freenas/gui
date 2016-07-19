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
    timezoneData: {
        value: null
    },

    timezoneOptions: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this.isLoading = true;
                this.application.systemGeneralService.getTimezoneData().then(function(timezoneData) {
                    self.timezoneData = timezoneData;
                    self.timezoneOptions = [];
                    for(var i=0; i<timezoneData.timezoneOptions.length; i++) {
                        self.timezoneOptions.push({label: timezoneData.timezoneOptions[i], value: timezoneData.timezoneOptions[i]})
                    }
                    self.isLoading = false;
                });
            }
        }
    }
});
