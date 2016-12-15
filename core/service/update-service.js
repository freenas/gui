var Montage = require("montage").Montage,
    UpdateRepository = require("core/repository/update-repository").UpdateRepository,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var UpdateService = exports.UpdateService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _config: {
        value: null
    },

    _remoteConfig: {
        value: null
    },

    constructor: {
        value: function() {
            this._dataService = FreeNASService.instance;
        }
    },

    getConfig: {
        value: function() {

            var self = this;
            if (this._config) {
                return Promise.resolve(this._config);
            } else {
                return this._dataService.fetchData(Model.Update).then(function(update) {
                    return self._config = update[0];
                });
            }
        }
    },

    saveConfig: {
        value: function() {
            return this._dataService.saveDataObject(this._config);
        }
    },

    getTrains: {
        value: function() {
            var self = this;
            return this._loadRemoteService().then(function() {
                return self._remoteService.trains();
            });
        }
    },

    getInfo: {
        value: function() {
            var self = this;
            return this._loadRemoteService().then(function() {
                return self._remoteService.updateInfo();
            });
        }
    },

    verify: {
        value: function() {
            return this.getConfig().then(function(config) {
                return config.services.verify();
            });
        }
    },

    checkAndDownload: {
        value: function() {
            var self = this;
            return this.getConfig().then(function(config) {
                return config.services.checkfetch();
            }).then(function() {
                return self.getInfo();
            });
        }
    },

    updateNow: {
        value: function(isRebootNeeded) {
            return this.getConfig().then(function(config) {
                return config.services.updatenow(isRebootNeeded);
            });
        }
    },

    applyUpdates: {
        value: function(isRebootNeeded) {
            return this.getConfig().then(function(config) {
                return config.services.apply(isRebootNeeded);
            });
        }
    },

    _loadRemoteService: {
        value: function() {
            var self = this;
            if (this._remoteService) {
                return Promise.resolve(this._remoteService);
            } else {
                return Model.populateObjectPrototypeForType(Model.Update).then(function (Update) {
                    self._remoteService = Update.constructor.services;
                });
            }
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new UpdateService();
                this._instance._updateRepository = UpdateRepository.getInstance();
            }
            return this._instance;
        }
    }
});
