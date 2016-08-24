/**
 * @module ui/language-and-region.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class LanguageAndRegion
 * @extends Component
 */
exports.LanguageAndRegion = Component.specialize(/** @lends LanguageAndRegion# */ {
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
                this._dataService = this.application.dataService;
                this._snapshotDataObjectsIfNecessary();
                this.isLoading = true;
                this.application.systemGeneralService.getTimezoneData().then(function(systemGeneral) {
                    self.timezoneData = systemGeneral.timezone;
                });
                this.application.systemGeneralService.getTimezoneOptions().then(function(timezoneOptions) {
                    self.timezoneOptions = [];
                    for(var i=0; i<timezoneOptions.length; i++) {
                        self.timezoneOptions.push({label: timezoneOptions[i], value: timezoneOptions[i]})
                    }
                });
                this.application.systemGeneralService.getKeymapOptions().then(function(keymapsData) {
                    self.keymapsOptions = [];
                    for(var i=0; i<keymapsData.length; i++) {
                        self.keymapsOptions.push({label: keymapsData[i][1], value: keymapsData[i][0]});
                    }
                });
                this.application.systemGeneralService.getConsoleKeymap().then(function(generalData) {
                    self.generalData = generalData;
                });
                self.isLoading = false;
            }
        }
    },

    save: {
        value: function() {
            return this.application.systemGeneralService.saveGeneralData(this.generalData);
        }
    },

    revert: {
        value: function() {
            this.timezoneData.timezone = this._originalTimezoneData.timezone;
            this.keymapsData.console_keymap = this._originalKeymapsData.console_keymap;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._originalTimezoneData) {
                this._originalTimezoneData = this._dataService.clone(this.timezoneData);
            }
            if (!this._originalKeymapsData) {
                this._originalKeymapsData = this._dataService.clone(this.keymapsData);
            }
        }
    }
});
