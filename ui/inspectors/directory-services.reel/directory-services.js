/**
 * @module ui/account-directory-services.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class DirectoryServices
 * @extends Component
 */
exports.DirectoryServices = Component.specialize({


    enterDocument: {
        value: function () {
            this._fetchDataIfNeeded();
        }
    },

    _fetchDataIfNeeded: {
        value: function () {
            if (!this._directories) {
                var self = this;

                this.application.dataService.fetchData(Model.Directory).then(function (directories) {
                    self._directories = directories;
                    self.addRangeAtPathChangeListener("_directories", self, "handleDirectoriesChange");
                    self.object.isLoading = false;
                });
            }
        }
    },

    handleDirectoriesChange: {
        value: function () {
            var directoryTypesKeyValuesKeys = Object.keys(this.constructor.DIRECTORY_TYPES_KEY_VALUES),
                directoryTypesValueKeys = this.constructor.DIRECTORY_TYPES_VALUE_KEYS,
                directoryServicesMap = new Map(),
                directories = this._directories,
                directoryServices, directoryService,
                directoryTypesValueKey,
                directoryTypesKeyValue,
                directory, i, length,
                promises = [],
                self = this;

            for (i = 0, length = directories.length; i < length; i++) {
                directoryService = directories[i];

                if ((directoryTypesValueKey = directoryTypesValueKeys[directoryService.plugin])) {
                    directoryServicesMap.set(directoryTypesValueKey, directoryService);
                }
            }

            for (i = 0, length = directoryTypesKeyValuesKeys.length; i < length; i++) {
                directoryTypesKeyValue = directoryTypesKeyValuesKeys[i];

                if (!directoryServicesMap.has(directoryTypesKeyValue)) {
                    promises.push(this._getNewDirectoryInstance(directoryTypesKeyValue));
                }
            }

            Promise.all(promises).then(function (directoryServices) {
                for (i = 0, length = directoryServices.length; i < length; i++) {
                    directoryServicesMap.set(directoryServices[i].plugin, directoryServices[i]);
                }

                self.directoryServices = self.application.dataService.setTypeForCollection(
                    directoryServicesMap.toArray(),
                    Model.Directory
                );
            });
        }
    },

    _getNewDirectoryInstance: {
        value: function (type) {
            var directoryTypesKeyValues = this.constructor.DIRECTORY_TYPES_KEY_VALUES;

            return this.application.dataService.getNewInstanceForType(Model.Directory).then(function (directory) {
                directory.plugin = directoryTypesKeyValues[type];

                return directory;
            });
        }
    }


}, {

    DIRECTORY_TYPES_KEY_VALUES: {
        value: {
            ACTIVE_DIRECTORY: "winbind",
            FREE_IPA: "freeipa"
        }
    },

    DIRECTORY_TYPES_VALUE_KEYS: {
        get: function () {
            if (!this._DIRECTORY_TYPES_VALUE_KEYS) {
                var keys = Object.keys(this.DIRECTORY_TYPES_KEY_VALUES),
                    types = this.DIRECTORY_TYPES_KEY_VALUES,
                    key;

                this._DIRECTORY_TYPES_VALUE_KEYS = {};

                for (var i = 0, length = keys.length; i < length; i++) {
                    key = keys[i];
                    this._DIRECTORY_TYPES_VALUE_KEYS[types[key]] = key;
                }
            }

            return this._DIRECTORY_TYPES_VALUE_KEYS;
        }
    }

});
