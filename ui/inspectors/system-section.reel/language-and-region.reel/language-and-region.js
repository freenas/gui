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

    keymapsOptions: {
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
                });
                this.application.systemGeneralService.getKeymapsData().then(function(keymapsData) {
                    self.keymapsData = keymapsData;
                    self.keymapsOptions = [];
                    for(var i=0; i<keymapsData.keymapsOptions.length; i++) {
                        self.keymapsOptions.push({label: keymapsData.keymapsOptions[i][1], value: keymapsData.keymapsOptions[i][0]});
                    }
                });
                self.isLoading = false;
            }
        }
    },

    save: {
        value: function() {
            var savingPromises = [];
            savingPromises.push(
                this.application.dataService.saveDataObject(this.timezoneData),
                this.application.dataService.saveDataObject(this.keymapsData)
            );
            return Promise.all(savingPromises);
        }
    }
});
