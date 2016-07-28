/**
 * @module ui/field-treeview.reel
 */
var AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delegate").AbstractComponentActionDelegate;

/**
 * @class FieldTreeview
 * @extends Component
 */
exports.FieldTreeview = AbstractComponentActionDelegate.specialize(/** @lends FieldTreeview# */ {
    handlePathButtonAction: {
        value: function () {
            this.isExpanded = !this.isExpanded;
        }
    }
});
