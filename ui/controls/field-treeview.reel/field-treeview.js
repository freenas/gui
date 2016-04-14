/**
 * @module ui/field-treeview.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FieldTreeview
 * @extends Component
 */
exports.FieldTreeview = Component.specialize(/** @lends FieldTreeview# */ {

    handlePathButtonAction: {
        value: function () {
            this.classList.toggle("isExpanded");
        }
    }
});
