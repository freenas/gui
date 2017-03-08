var Component = require('montage/ui/component').Component;

exports.IpAliases = Component.specialize({
    prepareForActivationEvents: {
        value: function () {
            this.addEventListener("action", this);
        }
    },

    tableWillUseNewEntry: {
        value: function() {
            return {
                type: 'INET',
                address: null,
                netmask: null
            };
        }
    },
    handleAddButtonAction: {
        value: function () {
            this.table.showNewEntryRow();
        }
    },
});
