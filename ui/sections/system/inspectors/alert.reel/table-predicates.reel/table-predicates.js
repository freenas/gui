var Component = require("montage/ui/component").Component;

exports.TablePredicates = Component.specialize({
    tableWillUseNewEntry: {
        value: function () {
            return {
                property: "class",
                operator: null,
                value: null
            }
        }
    }
});
