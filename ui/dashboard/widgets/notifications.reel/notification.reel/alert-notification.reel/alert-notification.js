/**
 * @module ui/notification.reel
 */
var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model,
    Evaluate = require("frb/evaluate");

/**
 * @class AlertNotification
 * @extends Component
 */
exports.AlertNotification = Component.specialize(/** @lends AlertNotification# */ {

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
            }
        },
        get: function () {
            return this._object;
        }
    },

    UIDescriptor: {
        value: null
    },

    // infoExpanded: {
    //     value: false
    // },

    enterDocument: {
        value: function() {
            this._loadAlertService();
        }
    },

    handleDismissButtonAction: {
        value: function () {
            var self = this;
            this._loadAlertService().then(function() {
                self._alertService.services.dismiss(self._object.jobId);
            });
        }
    },

    _loadAlertService: {
        value: function() {
            var self = this;
            if (this._alertService) {
                return Promise.resolve(this._alertService);
            } else {
                return Model.populateObjectPrototypeForType(Model.Alert).then(function (Alert) {
                    self._alertService = Alert.constructor;
                });
            }
        }
    }

});
