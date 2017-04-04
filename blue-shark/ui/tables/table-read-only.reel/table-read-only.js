/**
 * @module ui/table-read-only.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableReadOnly
 * @extends Component
 */
exports.TableReadOnly = Component.specialize({

    isSelectionEnabled: {
        value: false
    },

    clearSelection: {
        value: function () {
            this._tableComponent.rowRepetitionComponent.contentController.clearSelection();
        }
    }

});
