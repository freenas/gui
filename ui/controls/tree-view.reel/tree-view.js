/**
 * @module ui/tree-view.reel
 */
var AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delege").AbstractComponentActionDelegate,
    Promise = require("montage/core/promise").Promise;

/**
 * @class TreeView
 * @extends Component
 */
exports.TreeView = AbstractComponentActionDelegate.specialize({
    _selectedPath: {
        value: null
    },

    selectedPath: {
        get: function() {
            return this._selectedPath;
        },
        set: function(selectedPath) {
            if (this._selectedPath !== selectedPath) {
                this._selectedPath = selectedPath;
            }
            if (!this._selectedPath && this.controller.root) {
                this.selectedPath = this.controller.selectedPath;
            }
        }
    },

    handleBackButtonAction: {
        value: function () {
            if (this.controller.parent) {
                this.controller.open(this.controller.parent.path);
            }
        }
    },

    handleCancelAction: {
        value: function () {
            this.isExpanded = false;
        }
    },

    handleSelectAction: {
        value: function () {
            this.selectedPath = this.controller.selectedPath;
            this.isExpanded = false;
        }
    }
});
