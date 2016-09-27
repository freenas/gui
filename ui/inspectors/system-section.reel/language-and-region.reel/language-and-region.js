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

    shortDateFormats: {
        value: [
            "M/d/yy",
            "d/M/yy",
            "yy/M/d"
        ]
    },

    mediumDateFormats: {
        value: [
            "MM/dd/yy",
            "dd/MM/yy",
            "yy/MM/dd"
        ]
    },

    longDateFormats: {
        value: [
            "MMMM/dd/yyyy",
            "dd/MMMM/yyyy",
            "yyyy/MMMM/dd"
        ]
    },

    fullDateFormats: {
        value: [
            "dddd, MMMM/dd/yyyy",
            "dddd, dd/MMMM/yyyy",
            "yyyy/MMMM/dd, dddd"
        ]
    },

    shortTimeFormats: {
        value: [
            "h:m",
            "m:h"
        ]
    },

    mediumTimeFormats: {
        value: [
            "hh:mm:ss",
            "mm:hh:ss",
            "ss:mm:hh"
        ]
    },

    longTimeFormats: {
        value: [
            "hh:mm:ss tt",
            "mm:hh:ss tt",
            "ss:mm:hh tt"
        ]
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                loadingPromises = [];
            this.application.applicationContextService.findCurrentUser().then(function (user) {
                self.user = user;
                if (!user.attributes.userSettings) {
                    user.attributes.userSettings = {};
                }
                self._checkUserSettings(self.user);
            });
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
                var today = new Date();
                this.dateFormatShortOptions = this._generateDateFormatConvertedList(today, this.shortDateFormats);
                this.dateFormatMediumOptions = this._generateDateFormatConvertedList(today, this.mediumDateFormats);
                this.dateFormatLongOptions = this._generateDateFormatConvertedList(today, this.longDateFormats);
                this.dateFormatFullOptions = this._generateDateFormatConvertedList(today, this.fullDateFormats);
                this.timeFormatShortOptions = this._generateDateFormatConvertedList(today, this.shortTimeFormats);
                this.timeFormatMediumOptions = this._generateDateFormatConvertedList(today, this.mediumTimeFormats);
                this.timeFormatLongOptions = this._generateDateFormatConvertedList(today, this.longTimeFormats);
            }
        }
    },

    _generateDateFormatConvertedList: {
        value: function(today, dateOptionList) {
            var _formattedDateList = [];
            for (var i = 0,length = dateOptionList.length; i < length; i++) {
                this.dateConverter.pattern = dateOptionList[i];
                _formattedDateList.push({ label: this.dateConverter.convert(today), value: dateOptionList[i] });
            }
            return _formattedDateList;
        }
    },

    _checkUserSettings: {
        value: function(user){
            user.attributes.userSettings.timeFormatShort = user.attributes.userSettings.timeFormatShort || this.shortTimeFormats[0];
            user.attributes.userSettings.timeFormatMedium = user.attributes.userSettings.timeFormatMedium || this.mediumTimeFormats[0];
            user.attributes.userSettings.timeFormatLong = user.attributes.userSettings.timeFormatLong || this.longTimeFormats[0];
            user.attributes.userSettings.dateFormatShort = user.attributes.userSettings.dateFormatShort || this.shortDateFormats[0];
            user.attributes.userSettings.dateFormatMedium = user.attributes.userSettings.dateFormatMedium || this.mediumDateFormats[0];
            user.attributes.userSettings.dateFormatLong = user.attributes.userSettings.dateFormatLong || this.longDateFormats[0];
            user.attributes.userSettings.dateFormatFull = user.attributes.userSettings.dateFormatFull || this.fullDateFormats[0];
        }
    },

    save: {
        value: function() {
            this.application.applicationContextService.save();
            return this.application.systemGeneralService.saveGeneralData(this.generalData);
        }
    },

    revert: {
        value: function() {
            this.generalData.console_keymap = this._generalData.console_keymap;
            this.generalData.timezone = this._generalData.timezone;
            this.user.attributes.userSettings = this._dataService.clone(this._userSettings);
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._generalData) {
                this._generalData = this._dataService.clone(this.generalData);
            }
            if (!this._user) {
                this._userSettings = this._dataService.clone(this.user.attributes.userSettings);
            }
        }
    }
});
