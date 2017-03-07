var Component = require("montage/ui/component").Component;

exports.TablePort = Component.specialize({
    tableWillUseNewEntry: {
        value: function() {
            return {
                protocol: 'TCP'
            }
        }
    }
});
