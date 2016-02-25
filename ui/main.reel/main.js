
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize({

    enterDocument: {
        value: function() {
            this.application.section = 'dashboard';

            // Fixme: @benoit application modal is not added properly to the componentTree,
            // so the method enterDocument of its child components are not called.
            this.application.applicationModal.enterDocument(true);
        }
    }

});

// FIXME: Selection needs to be managed by a selection controller
