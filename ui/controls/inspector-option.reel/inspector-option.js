var Button = require("montage/ui/button.reel").Button;

/**
 * @class InspectorOption
 * @extends Component
 */
exports.InspectorOption = Button.specialize({

    hasTemplate: {
        value: true
    },

    handleAction: {
        value: function () {
            this.parentComponent.selectedObject = this.object;
        }
    }

});
