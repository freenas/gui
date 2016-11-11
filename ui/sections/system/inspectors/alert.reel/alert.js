/**
 * @module ui/inspectors/system-section.reel/alert.reel
 */
var Component = require("montage/ui/component").Component,
    AlertService = require("core/service/alert-service").AlertService,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

/**
 * @class Alert
 * @extends Component
 */
exports.Alert = Component.specialize(/** @lends Alert# */ {
    parentCascadingListItem: {
        get: function () {
            return this._parentCascadingListItem ||
                (this._parentCascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this));
        }
    },

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
                this.addPathChangeListener("parentCascadingListItem.selectedObject", this, "_handleSelectionChange");
                this.addPathChangeListener("selectedEntry", this, "_handleSelectionChange");
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
            if (this.parentCascadingListItem.selectedObject !== value) {
                this.parentCascadingListItem.selectedObject = value;
            } else {
        //        this.selectedEntry = value;
            }
        }
    }
});
