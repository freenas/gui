/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    prepareForActivationEvents: {
        value: function () {
            this.addEventListener("action", this);
        }
    },

    handleAddButtonAction: {
        value: function () {
            this.editableTable.showNewEntryRow();
        }
    },

    handleDeleteButtonAction: {
        value: function () {
            this.editableTable.deleteSelectedRows();
        }
    },

    tableDidCancelEditingNewEntry: {
        value: function (table, object, row) {
            console.log("table cancel adding object: ", object)
        }
    },

    tableWillAddNewEntry: {
        value: function (table, object, contentController) {
            console.log("table will add object: ", object)
        }
    },

    tableWillStartEditingNewEntry: {
        value: function (table, object, contentController) {
            console.log("table will edit object: ", object)

            if (!contentController.has(object)) {
                this.newObject = object;
            }
        }
    }

});
