
var AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delege").AbstractComponentActionDelegate,
    rootComponent = require("montage/ui/component").__root__;

/**
 * @class Main
 * @extends Component
 */
var Main = exports.Main = AbstractComponentActionDelegate.specialize({

    draw: {
        value: function () {
            var applicationModal = this.application.applicationModal;

            // Fixme: @benoit hacky application modal is not detached once the loader has finished its work.
            if (applicationModal !== rootComponent) {
                applicationModal.attachToParentComponent();
                applicationModal.enterDocument(true);
            }
        }
    },

    isDrawerOpen: {
        value: false
    },

    handleOpenDrawerButtonAction: {
        value: function () {
            this.application.isDrawerOpen = !this.application.isDrawerOpen;
        }
    }

});

Main.prototype.handleCloseButtonAction = Main.prototype.handleOpenDrawerButtonAction;
