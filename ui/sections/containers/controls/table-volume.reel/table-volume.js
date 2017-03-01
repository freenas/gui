var Component = require("montage/ui/component").Component;

exports.TableVolume = Component.specialize({
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

    tableWillUseNewEntry: {
        value: function() {
            return {
                origin: 'HOST'
            }
        }
    }
});
