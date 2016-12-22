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
            this.super();
            this.isExpanded = false;
            this._checkForPathInput();
        }
    },

    pathInputDelegate: {
        get: function() {
           var self = this;
           return {
                didEndEditing: function () {
                    self._checkForPathInput();
                }
            }
        }
    },

    _checkForPathInput: {
        value: function() {
            if (!this.pathInput.value) {
                this.selectedPath = null;
                this.dispatchOwnPropertyChange("selectedPath",this.selectedPath);
            } else if (this.allowPathInput) {
                var normalizedPath = this.pathInput.value,
                    suffix = '/' + (this.suffix || '');

                if (this.removePrefix) {
                    normalizedPath = this.removePrefix + normalizedPath;
                }

                if (normalizedPath.endsWith(suffix)) {
                    normalizedPath = normalizedPath.slice(0, -suffix.length);
                }

                while (normalizedPath.endsWith('/')) {
                    normalizedPath = normalizedPath.slice(0, -1);
                }

                this.selectedPath = normalizedPath;
                this.dispatchOwnPropertyChange("selectedPath", this.selectedPath);
            }
        }
    }
});
