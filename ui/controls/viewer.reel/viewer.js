var Component = require("montage/ui/component").Component;

/**
 * @class Viewer
 * @extends Component
 */
exports.Viewer = Component.specialize({

    handleCreateButtonAction: {
        value: function () {
            console.log("create");
        }
    }
});
