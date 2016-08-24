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
            var self = this,
                loadingPromises = [];
            if (isFirstTime) {
                this._dataService = this.application.dataService;
                this.isLoading = true;
                loadingPromises.push(
                    this.application.systemGeneralService.getTimezoneOptions().then(function(timezoneOptions) {
                        self.timezoneOptions = [];
                        for(var i=0; i<timezoneOptions.length; i++) {
                            self.timezoneOptions.push({label: timezoneOptions[i], value: timezoneOptions[i]})
                        }
                    }),
                    this.application.systemGeneralService.getKeymapOptions().then(function(keymapsData) {
                        self.keymapsOptions = [];
                        for(var i=0; i<keymapsData.length; i++) {
                            self.keymapsOptions.push({label: keymapsData[i][1], value: keymapsData[i][0]});
                        }
                    }),
                    this.application.systemGeneralService.getConsoleKeymap().then(function(generalData) {
                        self.generalData = generalData;
                        self._snapshotDataObjectsIfNecessary();
                    })
                );
                Promise.all(loadingPromises).then(function() {
                    this.isLoading = false;
                });
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
            this.generalData.console_keymap = this._generalData.console_keymap;
            this.generalData.timezone = this._generalData.timezone;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._generalData) {
                this._generalData = this._dataService.clone(this.generalData);
                console.log(this._generalData, this.generalData);
            }
        }
    }
});
