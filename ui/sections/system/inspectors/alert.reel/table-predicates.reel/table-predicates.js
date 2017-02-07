var Component = require("montage/ui/component").Component,
    _ = require("lodash");

exports.TablePredicates = Component.specialize({
    tableWillUseNewEntry: {
        value: function () {
            return {
                property: "class",
                operator: null,
                value: null,
                _disabled: false
            }
        }
    }
});

