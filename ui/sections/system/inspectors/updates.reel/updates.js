var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    UpdateService = require("core/service/update-service-ng").UpdateService,
    Promise = require("montage/core/promise").Promise,
    _ = require("lodash");

exports.Updates = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this._updateService = UpdateService.getInstance();
            return Promise.all([
                this._updateService.getConfig(),
                this._updateService.getTrains(),
                this._refreshUpdateInfo()
            ]).spread(function(config, trains) {
                self.config = config;
                self.trains = trains;
            });
        }
    },

    enterDocument: {
        value: function() {
            var self = this;
            this.isLoading = true;
            return this._updateService.check().then(function() {
                self._refreshUpdateInfo();
                self.isLoading = false;
            });
        }
    },

    _refreshUpdateInfo: {
        value: function() {
            var self = this;
            return this._updateService.getInfo().then(function(info) {
                self.info = info;
            });
        }
    },

    handleInstallUpdateAction: {
        value: function() {
            this._updateService.apply(true);
        }
    },

    handleVerifyAction: {
        value: function() {
            this._updateService.verify();
        }
    },

    handleCheckDownloadAction: {
        value: function() {
            var self = this;
            this._updateService.checkAndDownload().then(function(info) {
                self.info = info;
            });
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
