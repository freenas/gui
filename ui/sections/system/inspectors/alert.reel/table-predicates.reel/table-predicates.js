var Component = require("montage/ui/component").Component,
    _ = require("lodash");

exports.TablePredicates = Component.specialize({
    tableWillUseNewEntry: {
        value: function () {
            return {
                _isNew: true,
                index: null,
                class: null,
                emitter: 'EMAIL',
                parameters: {
                    "%type": 'AlertEmitterEmail',
                    "addresses": []
                }
            }
        }
    }
});

