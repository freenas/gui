var Component = require("montage/ui/component").Component;

/**
 * @class MainSidebar
 * @extends Component
 */
exports.MainSidebar = Component.specialize({
    isFlipped: {
        value: false
    },

    handleLogoButtonAction: {
        value: function () {
            this.isFlipped = !this.isFlipped;
        }
    }
});
