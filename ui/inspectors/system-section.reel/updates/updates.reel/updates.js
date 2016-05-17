/**
 * @module ui/updates.reel
 */
var Component = require("montage/ui/component").Component,
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

    updateOps: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            this.isLoading = true;
            if (isFirstTime) {
                this._dataService = this.application.dataService;
            }
            this._loadUpdateService().then(function() {
                var promises = [];
                promises.push(
                    self._dataService.fetchData(Model.Update).then(function(update) {
                        return self.config = update[0];
                    }),
                    self._updateService.trains().then(function(trains) {
                        return self.trains = trains;
                    }),
                    self._updateService.getUpdateOps().then(function(updateOps) {
                        return self.updateOps = updateOps;
                    })
                );
                return Promise.all(promises);
            }).then(function() {
                self.isLoading = false;
            });
        }
    },

    handleInstallUpdateAction: {
        value: function() {
            this.config.apply(true);
        }
    },

    handleDownloadUpdateAction: {
        value: function() {
            this.config.download();
        }
    },

    handleVerifyAction: {
        value: function() {
            this.config.verify();
        }
    },

    handleCheckUpdateAction: {
        value: function() {
            var self = this;
            this.config.check().then(function() {
               return self._updateService.getUpdateOps()
            }).then(function(updateOps) {
                return self.updateOps = updateOps;
            });
        }
    },

    handleUpdateNowAction: {
        value: function() {
            this.config.updatenow(true);
        }
    },

    _loadUpdateService: {
        value: function() {
            var self = this;
            if (this._updateService) {
                return Promise.resolve(this._updateService);
            } else {
                return Model.populateObjectPrototypeForType(Model.Update).then(function (Update) {
                    self._updateService = Update.constructor;
                });
            }
        }
    }
});
