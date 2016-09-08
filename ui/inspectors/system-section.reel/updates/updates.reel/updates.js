/**
 * @module ui/updates.reel
 */
var Component = require("montage/ui/component").Component,
    UpdateService = require("core/service/update-service").UpdateService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class Updates
 * @extends Component
 */
exports.Updates = Component.specialize(/** @lends Updates# */ {
    config: {
        value: null
    },

    trains: {
        value: null
    },

    info: {
        value: null
    },

    _remoteConfig: {
        value: null
    },

    _updateService: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            this.isLoading = true;
            if (isFirstTime) {
                this._dataService = this.application.dataService;
                this._updateService = this.application.updateService;
            }
            var promises = [
                self._updateService.getConfig().then(function(config) {
                    self._cacheRemoteConfig(config);
                    return self.config = config;
                }),
                self._updateService.getTrains().then(function(trains) {
                    return self.trains = trains;
                }),
                self._updateService.getInfo().then(function(info) {
                    return self.info = info;
                })
            ];
            Promise.all(promises).then(function() {
                self.isLoading = false;
            });
        }
    },

    handleInstallUpdateAction: {
        value: function() {
            this._updateService.applyUpdates(true);
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
            this._updateService.saveConfig().then(function() {
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
            this._remoteConfig = {
                check_auto: config.check_auto,
                train: config.train
            };
        }
    }
});
