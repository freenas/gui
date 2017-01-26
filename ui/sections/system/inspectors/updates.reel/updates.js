var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    UpdateService = require("core/service/update-service").UpdateService,
    Promise = require("montage/core/promise").Promise,
    _ = require("lodash");

exports.Updates = AbstractInspector.specialize({
    currentVersion: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this._updateService = UpdateService.getInstance();
                Promise.all([
                    this._updateService.getConfig(),
                    this._updateService.getTrains(),
                    this._sectionService.getSystemVersion()
                ]).spread(function(config, trains, version) {
                    self.config = config;
                    self.trains = trains;
                    self.currentVersion = version;
                });
            }

            if (this._inDocument) {
                this._updateService.check().then(function(taskSubmission) {
                    return taskSubmission.taskPromise;
                }).then(function() {
                    self._updateService.getInfo().then(function(info) {
                        self.info = info;
                    });
                });
            }
        }
    },

    handleVerifyAction: {
        value: function() {
            this._updateService.verify();
        }
    },

    handleUpdateNowAction: {
        value: function() {
            this._updateService.updateNow(true);
        }
    },

    handleSaveAction: {
        value: function() {
            var self = this,
                config = {
                    check_auto: this.config.check_auto,
                    train: this.config.train
                };
            this._updateService.saveConfig(config).then(function() {
                self._cacheRemoteConfig(config);
            });
        }
    },

    handleRevertAction: {
        value: function() {
            this.config.check_auto = this._remoteConfig.check_auto;
            this.config.train = this._remoteConfig.train;
        }
    },

    _cacheRemoteConfig: {
        value: function(config) {
            this._remoteConfig = _.cloneDeep(config);
        }
    }
});
