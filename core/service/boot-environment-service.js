var Montage = require("montage").Montage,
    BootPoolRepository = require("core/repository/boot-pool-repository").BootPoolRepository,
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
            Model.populateObjectPrototypeForType(Model.BootEnvironment).then(function() {
                self._methods = Model.BootEnvironment.objectPrototype.services;
            });
            this.addRangeAtPathChangeListener("_bootEnvironments", this, "_handleBootEnvironmentsChange");
        }
    },

    list: {
        value: function() {
            var self = this;
            return this._bootPoolRepository.listBootEnvironments().then(function(bootEnvironments) {
                return self._bootEnvironments = bootEnvironments;
            });
        }
    },

    delete: {
        value: function(bootEnvironment) {
            return this._bootPoolRepository.deleteBootEnvironment(bootEnvironment);
        }
    },

    getBootVolumeConfig: {
        value: function() {
            var self = this;
            return this._bootPoolRepository.getBootPoolConfig().then(function(bootVolumeConfig) {
                return self._bootVolumeConfig = bootVolumeConfig.data;
            });
        }
    },

    scrubBootPool: {
        value: function() {
            return this._bootPoolRepository.scrubBootPool();
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

            return this._bootPoolRepository.activateBootEnvironment(bootEnvironment).then(function () {
                currentBootEnvironment.onReboot = false;
                bootEnvironment.onReboot = true;
                return bootEnvironment;
            });
        }
    },

    saveBootEnvironment: {
        value: function(bootEnvironment) {
            return this._bootPoolRepository.saveBootEnvironment(bootEnvironment).then(function() {
                return bootEnvironment;
            })
        }
    },

    keepBootEnvironment: {
        value: function(bootEnvironment) {
            bootEnvironment.keep = true;
            return this.saveBootEnvironment(bootEnvironment);
        }
    },

    dontKeepBootEnvironment: {
        value: function(bootEnvironment) {
            bootEnvironment.keep = false;
            return this.saveBootEnvironment(bootEnvironment);
        }
    },

    cloneBootEnvironment: {
        value: function(bootEnvironment) {
            var self = this,
                cloneName = this._findAvailableBootEnvironmentNameWithName(bootEnvironment.persistedId);

            //FIXME: not safe! new name should be created by the middleware!!
            return this._bootPoolRepository.cloneBootEnvironment(bootEnvironment, cloneName).finally(function () {
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
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new BootEnvironmentService();
                this._instance._bootPoolRepository = BootPoolRepository.getInstance();
            }
            return this._instance;
        }
    }
});
