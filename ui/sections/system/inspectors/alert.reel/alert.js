/**
 * @module ui/inspectors/system-section.reel/alert.reel
 */
var Component = require("montage/ui/component").Component,
    AlertService = require("core/service/alert-service").AlertService;

/**
 * @class Alert
 * @extends Component
 */
exports.Alert = Component.specialize(/** @lends Alert# */ {
    templateDidLoad: {
        value: function () {
            var self = this;
            this._service = AlertService.instance;
            this._service.loadEntries().then(function (entries) {
                self.entries = entries;
            });
            this._service.loadSettings().then(function (settings) {
                self.settings = settings;
            })
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
//                this.addPathChangeListener("context.cascadingListItem.selectedObject", this, "_handleSelectionChange");
//                this.addPathChangeListener("selectedEntry", this, "_handleSelectionChange");
            }
        }
    },

    _handleSelectionChange: {
        value: function(value) {
            if (value) {
                if (this.selectedEntry !== value) {
                    this.selectedEntry = null;
                }
            }
            if (this.context.cascadingListItem.selectedObject !== value) {
                this.context.cascadingListItem.selectedObject = value;
            } else {
                this.selectedEntry = value;
            }
        }
    }
});
