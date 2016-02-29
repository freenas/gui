/**
 * @module ui/inspector-footer.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class InspectorFooter
 * @extends Component
 */
exports.InspectorFooter = Component.specialize({

    handleDeleteAction: function () {
        console.log("delete");
    },

    handleRevertAction: function () {
        console.log("revert");
    },

    handleSaveAction: function () {
        console.log("save");
    }
});
