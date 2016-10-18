/**
 * @module ui/field-treeview.reel
 */
var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

/**
 * @class FieldTreeview
 * @extends Component
 */
exports.FieldTreeview = AbstractComponentActionDelegate.specialize(/** @lends FieldTreeview# */ {
    handleBrowseButtonAction: {
        value: function () {
            this.isExpanded = !this.isExpanded;
        }
    },

    enterDocument: {
        value: function () {
            this._checkForEmptyPath();
        }
    },

    pathInputDelegate: {
        get: function() {
           var self = this;
           return {
                didEndEditing: function () {
                    self._checkForEmptyPath();
                }
            }
        }
    },

    _checkForEmptyPath: {
        value: function () {
            if (!this.pathInput.value) {
                this.selectedPath = null;
                this.dispatchOwnPropertyChange("selectedPath",this.selectedPath);
            }
        }
    }
});
