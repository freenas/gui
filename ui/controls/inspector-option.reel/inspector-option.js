var Button = require("montage/ui/button.reel").Button;

/**
 * @class InspectorOption
 * @extends Component
 */
exports.InspectorOption = Button.specialize({

    hasTemplate: {
        value: true
    },

    // FIXME: this is a Josh Hack to get past the scrollview component

    handleAction: {
        value: function () {
            if (this.parentComponent.indentifier = "scrollView") {
                this.parentComponent.parentComponent.selectedObject = this.object;
            } else {
                this.parentComponent.selectedObject = this.object;
            }
        }
    }

});
