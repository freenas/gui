var Component = require("montage/ui/component").Component;

exports.TablePort = Component.specialize({
    enterDocument: {
        value: function () {
            this.addEventListener("action", this);
        }
    },

    handleAddButtonAction: {
        value: function () {
            this.table.showNewEntryRow();
        }
    },

    tableWillUseNewEntry: {
        value: function() {
            return {
                protocol: 'TCP'
            }
        }
    }
});
