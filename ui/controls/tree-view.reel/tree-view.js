/**
 * @module ui/tree-view.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TreeView
 * @extends Component
 */
exports.TreeView = Component.specialize({

    handleCancelAction: {
        value: function () {
            alert("cancel");
        }
    },

    handleSelectAction: {
        value: function () {
            alert("select Action");
        }
    }
});
