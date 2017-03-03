var Component = require("montage/ui/component").Component;

exports.TableVolume = Component.specialize({
    tableWillUseNewEntry: {
        value: function() {
            return {
                origin: 'HOST'
            }
        }
    }
});
