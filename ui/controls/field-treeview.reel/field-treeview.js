/**
 * @module ui/field-treeview.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FieldTreeview
 * @extends Component
 */
exports.FieldTreeview = Component.specialize(/** @lends FieldTreeview# */ {
    _close: {
        value: null
    },

    close: {
        get: function() {
            return this._close;
        },
        set: function(close) {
            this._close = close;
            if (close) {
                this.classList.remove("isExpanded");
            }
        }
    },

    handlePathButtonAction: {
        value: function () {
            this.classList.toggle("isExpanded");
            if (this.classList.has("isExpanded")) {
                this.originalValue = this.parentPath;
                this.close = false;
            }
        }
    }
});
