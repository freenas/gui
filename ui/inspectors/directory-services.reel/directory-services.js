/**
 * @module ui/account-directory-services.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    AccountSectionService = require("core/service/section/account-section-service").AccountSectionService,
    Model = require("core/model/model").Model;

/**
 * @class DirectoryServices
 * @extends Component
 */
exports.DirectoryServices = AbstractInspector.specialize({

    enterDocument: {
        value: function () {
            var self = this;
            this.super();
            this._fetchDataIfNeeded();
            this._listNtpServers().then(function(ntpServers) {
                if (ntpServers.length > 0) {
                    self.ntpServer = ntpServers[0].address;
                    console.log(self.ntpServer);
                }
            });
        }
    },

    //TODO: remove when account will have been migrated to the new architecture.
    _sectionService: {
        get: function () {
            return AccountSectionService.instance;
        }
    },

    templateDidLoad: {
        value: function() {
            this._ntpServerService = this.application.ntpServerService;
        }
    },

    handleDirectoriesChange: {
        value: function () {
            var directoryTypesKeyValuesKeys = Object.keys(this.constructor.DIRECTORY_TYPES_KEY_VALUES),
                directoryTypesValueKeys = this.constructor.DIRECTORY_TYPES_VALUE_KEYS,
                directoryTypesLabels = this.constructor.DIRECTORY_TYPES_LABELS,
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

                if ((directoryTypesValueKey = directoryTypesValueKeys[directoryService.type]) && directoryService.name) {
                    directoryServicesMap.set(directoryTypesValueKey, directoryService);
                    directoryService.label = directoryTypesLabels[directoryService.type];
                }
            }

            for (i = 0, length = directoryTypesKeyValuesKeys.length; i < length; i++) {
                directoryTypesKeyValue = directoryTypesKeyValuesKeys[i];

                if (!directoryServicesMap.has(directoryTypesKeyValue)) {
                    promises.push(this._getNewDirectoryInstance(directoryTypesKeyValue));
                }
            }

            promises.push(this._sectionService.getKerberosRealmEmptyList());
            promises.push(this._sectionService.getKerberosKeytabEmptyList());

            Promise.all(promises).then(function (directoryServices) {
                var directoryService;

                for (i = 0, length = directoryServices.length; i < length; i++) {
                    directoryService = directoryServices[i];

                    directoryServicesMap.set(directoryServices[i].type || i, directoryService);
                }

                self.directoryServices = self.application.dataService.setTypeForCollection(
                    directoryServicesMap.toArray(),
                    Model.Directory
                );
            });
        }
    },

    handleRevertAction: {
        value: function() {
            this.directoryServiceConfig.search_order = this._originalSearchOrder.slice();
        }
    },

    handleSaveAction: {
        value: function() {
            var self = this;
            this.application.dataService.saveDataObject(this.directoryServiceConfig).then(function() {
                self._originalSearchOrder = self.directoryServiceConfig.search_order.slice();
            });
        }
    },

    _fetchDataIfNeeded: {
        value: function () {
            if (!this._directories) {
                var self = this;

                this.application.dataService.fetchData(Model.DirectoryserviceConfig).then(function(directoryServiceConfig) {
                    self.directoryServiceConfig = directoryServiceConfig[0];
                    self._originalSearchOrder = self.directoryServiceConfig.search_order.slice();
                    return self.application.dataService.fetchData(Model.Directory)
                }).then(function (directories) {
                    self._directories = directories;
                    self.addRangeAtPathChangeListener("_directories", self, "handleDirectoriesChange");
                    self.object.isLoading = false;
                });
            }
        }
    },

    _getNewDirectoryInstance: {
        value: function (type) {
            var directoryTypesKeyValues = this.constructor.DIRECTORY_TYPES_KEY_VALUES,
                directoryTypesLabels = this.constructor.DIRECTORY_TYPES_LABELS;

            return this.application.dataService.getNewInstanceForType(Model.Directory).then(function (directory) {
                directory.type = directoryTypesKeyValues[type];
                directory.parameters = {"%type": directory.type + "-directory-params"};
                directory.label = directoryTypesLabels[directory.type];

                return directory;
            });
        }
    },

    _listNtpServers: {
        value: function() {
            var self = this;
            return this._sectionService.listNtpServers().then(function(ntpServers) {
                self.ntpServerOptions = ntpServers.map(function(x) {
                    return { label: x.address, value: x.address };
                });
                return ntpServers;
            });
        }
    },

    handleNtpSyncNowAction: {
        value: function() {
            return this._ntpServerService.ntpSyncNow(this.ntpServer);
        }
    }

}, {

    DIRECTORY_TYPES_LABELS: {
        value: {
            winbind: "Active Directory",
            freeipa: "FreeIPA",
            ldap: "LDAP",
            nis: "NIS"
        }
    },

    DIRECTORY_TYPES_KEY_VALUES: {
        value: {
            ACTIVE_DIRECTORY: "winbind",
            FREE_IPA: "freeipa",
            LDAP: "ldap",
            NIS: "nis"
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
