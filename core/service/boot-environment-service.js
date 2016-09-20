var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var BootEnvironmentService = exports.BootEnvironmentService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _methods: {
        value: null
    },

    _remoteService: {
        value: null
    },

    _bootEnvironments: {
        value: null
    },

    _bootVolumeConfig: {
        value: null
    },

    _pendingBootEnvironmentNames: {
        value: []
    },

    constructor: {
        value: function() {
            var self = this;
            this._dataService = FreeNASService.instance;
            Model.populateObjectPrototypeForType(Model.BootEnvironment).then(function() {
                self._methods = Model.BootEnvironment.objectPrototype.services;
            });
            this.addRangeAtPathChangeListener("_bootEnvironments", this, "_handleBootEnvironmentsChange");
        }
    },

    list: {
        value: function() {
            var self = this;
            return this._dataService.fetchData(Model.BootEnvironment).then(function(bootEnvironments) {
                return self._bootEnvironments = bootEnvironments;
            });
        }
    },

    delete: {
        value: function(bootEnvironment) {
            return this._dataService.deleteDataObject(bootEnvironment);
        }
    },

    getBootVolumeConfig: {
        value: function() {
            var self = this;
            return this._dataService.callBackend("boot.pool.get_config").then(function(bootVolumeConfig) {
                return self._bootVolumeConfig = bootVolumeConfig.data;
            });
        }
    },

    canDeleteBootEnvironment: {
        value: function(bootEnvironment) {
            return bootEnvironment && !bootEnvironment.onReboot && !bootEnvironment.active;
        }
    },

    canActivateBootEnvironment: {
        value: function(bootEnvironment) {
            return bootEnvironment && !bootEnvironment.onReboot;
        }
    },

    activateBootEnvironment: {
        value: function(bootEnvironment) {
            var currentBootEnvironment = this._findCurrentBootEnvironment();

            return this._methods.activate(bootEnvironment.persistedId).then(function () {
                currentBootEnvironment.onReboot = false;
                bootEnvironment.onReboot = true;
            });
        }
    },

    persistBootEnvironmentRenaming: {
        value: function(bootEnvironment) {
            return this._dataService.saveDataObject(bootEnvironment);
        }
    },

    cloneBootEnvironment: {
        value: function(bootEnvironment) {
            var self = this,
                cloneName = this._findAvailableBootEnvironmentNameWithName(bootEnvironment.persistedId);

            //FIXME: not safe! new name should be created by the middleware!!
            return this._methods.clone(cloneName, bootEnvironment.persistedId).finally(function () {
                self._pendingBootEnvironmentNames.splice(self._pendingBootEnvironmentNames.indexOf(cloneName), 1);
            });
        }
    },

    getLastUsedBootEnvironmentIndex: {
        value: function (lastUsedBootEnvironmentIndex, regexLastIndex, regexBootEnvironmentName) {
            var bootEnvironmentId, data;

            for (var i = 0, length = this._bootEnvironments.length; i < length; i++) {
                bootEnvironmentId = this._bootEnvironments[i].id || this._bootEnvironments[i];

                if (regexBootEnvironmentName.test(bootEnvironmentId)) {
                    data = regexLastIndex.exec(bootEnvironmentId);

                    if (data && data[2] > lastUsedBootEnvironmentIndex) {
                        lastUsedBootEnvironmentIndex = data[2];
                    }
                }
            }

            return lastUsedBootEnvironmentIndex;
        }
    },

    _handleBootEnvironmentsChange: {
        value: function (plus, minus) {
            if (plus.length) {
                var bootEnvironment;

                for (var i = 0, length = plus.length; i < length; i++) {
                    bootEnvironment = plus[i];
                    bootEnvironment.onReboot = bootEnvironment.on_reboot;
                }
            }
        }
    },

    _findLastUsedBootEnvironmentIndex: {
        value: function (bootEnvironments, lastUsedBootEnvironmentIndex, regexLastIndex, regexBootEnvironmentName) {
            var bootEnvironmentId, data;

            for (var i = 0, length = bootEnvironments.length; i < length; i++) {
                bootEnvironmentId = bootEnvironments[i].id || bootEnvironments[i];

                if (regexBootEnvironmentName.test(bootEnvironmentId)) {
                    data = regexLastIndex.exec(bootEnvironmentId);

                    if (data && data[2] > lastUsedBootEnvironmentIndex) {
                        lastUsedBootEnvironmentIndex = data[2];
                    }
                }
            }

            return lastUsedBootEnvironmentIndex;
        }
    },

    _findAvailableBootEnvironmentNameWithName: {
        value: function (bootEnvironmentName) {
            var bootEnvironments = this._bootEnvironments,
                regexLastIndex = /(-copy-([0-9]+)$)/,
                dataBootEnvironmentName = regexLastIndex.exec(bootEnvironmentName),
                regexBootEnvironmentName, lastUsedBootEnvironmentIndex;

            if (dataBootEnvironmentName) {
                lastUsedBootEnvironmentIndex = dataBootEnvironmentName[2];
                bootEnvironmentName = bootEnvironmentName.replace(new RegExp(dataBootEnvironmentName[0]), "");
                regexBootEnvironmentName = new RegExp("^" + bootEnvironmentName + "-copy-[0-9]+$");
            } else {
                lastUsedBootEnvironmentIndex = 0;
                regexBootEnvironmentName = new RegExp("^" + bootEnvironmentName);
            }

            lastUsedBootEnvironmentIndex = this._findLastUsedBootEnvironmentIndex(
                bootEnvironments, lastUsedBootEnvironmentIndex, regexLastIndex, regexBootEnvironmentName
            );

            lastUsedBootEnvironmentIndex = this._findLastUsedBootEnvironmentIndex(
                this._pendingBootEnvironmentNames, lastUsedBootEnvironmentIndex, regexLastIndex, regexBootEnvironmentName
            );

            var availableBootEnvironmentNameWithName = bootEnvironmentName + "-copy-" + ++lastUsedBootEnvironmentIndex;
            this._pendingBootEnvironmentNames.push(availableBootEnvironmentNameWithName);

            return availableBootEnvironmentNameWithName;
        }
    },

    _findCurrentBootEnvironment: {
        value: function () {
            var bootEnvironment;
            if (this._bootEnvironments) {
                for (var i = 0, length = this._bootEnvironments.length; i < length; i++) {
                    bootEnvironment = this._bootEnvironments[i];
                    if (bootEnvironment.onReboot) {
                       return bootEnvironment;
                    }
                }
            }
        }
    },

    _loadRemoteService: {
        value: function() {
            var self = this;
            if (this._remoteService) {
                return Promise.resolve(this._remoteService);
            } else {
                return Model.populateObjectPrototypeForType(Model.BootEnvironment).then(function (BootEnvironment) {
                    self._remoteService = BootEnvironment.constructor.services;
                });
            }
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new BootEnvironmentService();
            }
            return this._instance;
        }
    }
});
