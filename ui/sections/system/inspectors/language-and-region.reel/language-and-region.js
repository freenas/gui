var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    _ = require("lodash");

exports.LanguageAndRegion = AbstractInspector.specialize(/** @lends LanguageAndRegion# */ {
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
            var self = this;
            this.application.applicationContextService.findCurrentUser().then(function (user) {
                self.user = user;
                if (!user.attributes.userSettings) {
                    user.attributes.userSettings = {};
                }
                self.setDefaultDateAndTimeFormat(self.user.attributes.userSettings);
            });
            if (isFirstTime) {
                this._dataService = this.application.dataService;
                this.isLoading = true;
                Promise.all([
                    this._sectionService.getTimezoneOptions().then(function(timezoneOptions) {
                        self.timezoneOptions = timezoneOptions.map(function(x) {
                            return {label: x, value: x};
                        });
                    }),
                    this._sectionService.getKeymapOptions().then(function(keymapsData) {
                        self.keymapsOptions = keymapsData.map(function(x) {
                            return {label: x[1], value: x[0]};
                        });
                    }),
                    this._sectionService.getSystemGeneral().then(function(systemGeneral) {
                        self.generalData = systemGeneral;
                        self._snapshotDataObjectsIfNecessary();
                    })
                ]).then(function() {
                    self.isLoading = false;
                });
                var today = new Date();
                this.dateFormatShortOptions = this.generateDateFormatConvertedList(today, this.shortDateFormats);
                this.dateFormatMediumOptions = this.generateDateFormatConvertedList(today, this.mediumDateFormats);
                this.dateFormatLongOptions = this.generateDateFormatConvertedList(today, this.longDateFormats);
                this.dateFormatFullOptions = this.generateDateFormatConvertedList(today, this.fullDateFormats);
                this.timeFormatShortOptions = this.generateDateFormatConvertedList(today, this.shortTimeFormats);
                this.timeFormatMediumOptions = this.generateDateFormatConvertedList(today, this.mediumTimeFormats);
                this.timeFormatLongOptions = this.generateDateFormatConvertedList(today, this.longTimeFormats);
            }
        }
    },

    generateDateFormatConvertedList: {
        value: function(today, dateOptionList) {
            var formattedDateList = [];
            for (var i = 0,length = dateOptionList.length; i < length; i++) {
                this.dateConverter.pattern = dateOptionList[i];
                formattedDateList.push({label: "'" + this.dateConverter.convert(today) + "'", value: dateOptionList[i]});
            }
            return formattedDateList;
        }
    },

    setDefaultDateAndTimeFormat: {
        value: function(userSettings) {
            userSettings.timeFormatShort = userSettings.timeFormatShort || this.shortTimeFormats[0];
            userSettings.timeFormatMedium = userSettings.timeFormatMedium || this.mediumTimeFormats[0];
            userSettings.timeFormatLong = userSettings.timeFormatLong || this.longTimeFormats[0];
            userSettings.dateFormatShort = userSettings.dateFormatShort || this.shortDateFormats[0];
            userSettings.dateFormatMedium = userSettings.dateFormatMedium || this.mediumDateFormats[0];
            userSettings.dateFormatLong = userSettings.dateFormatLong || this.longDateFormats[0];
            userSettings.dateFormatFull = userSettings.dateFormatFull || this.fullDateFormats[0];
        }
    },

    save: {
        value: function() {
            return Promise.all([
                this.application.applicationContextService.save(),
                this.application.systemGeneralService.saveGeneralData(this.generalData)
            ]);
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
                this._generalData = _.cloneDeep(this.generalData);
            }
            if (!this._user) {
                this._userSettings = _.cloneDeep(this.user.attributes.userSettings);
            }
        }
    }
});
