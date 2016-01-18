var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize({
    enterDocument: {
        value: function() {
            this.application.section = 'storage';
        }
    }
});

// FIXME: Selection needs to be managed by a selection controller
