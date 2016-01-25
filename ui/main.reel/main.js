var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize({
    enterDocument: {
        value: function() {
            this.application.section = 'dashboard';
        }
    }
});

// FIXME: Selection needs to be managed by a selection controller
