var Component = require("montage/ui/component").Component;

exports.TableHeader = Component.specialize({

    prepareForActivationEvents: {
        value: function () {
            this.addEventListener("action", this);
        }
    },

    handleAddButtonAction: {
        value: function () {
            this.table.showNewEntryRow();
        }
    },

    handleDeleteButtonAction: {
        value: function () {
            this.table.deleteSelectedRows();
        }
    }

});
