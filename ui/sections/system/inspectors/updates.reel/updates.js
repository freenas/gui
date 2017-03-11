var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    UpdateService = require("core/service/update-service").UpdateService,
    Promise = require("montage/core/promise").Promise,
    marked = require('marked'),
    _ = require("lodash");

exports.Updates = AbstractInspector.specialize({
    currentVersion: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime || this.noServer) {
                this._updateService = UpdateService.getInstance();
                this._sectionService.getSystemVersion().then(function(version){
                    self.currentVersion = version;
                })
                Promise.all([
                    this._updateService.getConfig(),
                    this._updateService.getTrains()
                ]).spread(function(config, trains) {
                    self.config = config;
                    self.trains = trains;
                    self._cacheRemoteConfig(config);
                    self.noServer = false
                }).catch(function() {
                    self.noServer = true
                });
            }

            self.checkForUpdate();
        }
    },

    checkForUpdate: {
        value: function() {
            var self = this;
            if (this._inDocument && !this.updatePromise) {
                this.updatePromise = this._updateService.check().then(function(taskSubmission) {
                    return taskSubmission.taskPromise;
                }).then(function() {
                    self._updateService.getInfo().then(function(info) {
                        self.info = info;
                        self.parsedHtml = marked(_.replace(_.join(self.info.changelog, "\n"), /## /g, "\n## "));
                    });
                    self.updatePromise = null;
                }).catch(function() {
                    self.noServer = true;
                    self.updatePromise = null;
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

    save: {
        value: function() {
            if (this.config) {
                var self = this,
                    config = {
                        check_auto: this.config.check_auto,
                        train: this.config.train
                    };
                this._updateService.saveConfig(config).then(function(taskSubmission) {
                    self._cacheRemoteConfig(config);
                    if (taskSubmission) {
                        return taskSubmission.taskPromise.then(function() {
                            self.checkForUpdate();
                        });
                    }
                });
            }
        }
    },

    revert: {
        value: function() {
            if (this._remoteConfig) {
                this.config.check_auto = this._remoteConfig.check_auto;
                this.config.train = this._remoteConfig.train;
            }
        }
    },

    _cacheRemoteConfig: {
        value: function(config) {
            this._remoteConfig = _.cloneDeep(config);
        }
    }
});
