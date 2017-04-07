var Component = require("montage/ui/component").Component;

exports.TableHosts = Component.specialize({
    tableWillUseNewEntry: {
        value: function () {
            return {
                _isNew: true,
                id: null,
                addresses: []
            }
        }
    },

    tableWillDeleteEntry: {
        value: function(host) {
            this.controller.markHostAsDeleted(host);
        }
    },

    enterDocument: {
        value: function () {
            this.addEventListener("action", this);
        }
    },

    exitDocument: {
        value: function() {
            this.removeEventListener("action", this);
        }
    },

    handleAddButtonAction: {
        value: function () {
            this.table.showNewEntryRow();
        }
    }
});
