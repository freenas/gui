
var ComponentModule = require("montage/ui/component"),
    Component = ComponentModule.Component,
    rootComponent = ComponentModule.__root__;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize({

    enterDocument: {
        value: function (firsTime) {
        }
    },

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

    _toggleDrawer: {
        value: function () {
            this.isDrawerOpen = !this.isDrawerOpen;
        }
    },

    handleCloseButtonAction: {
        value: function () { this._toggleDrawer(); }
    },

    handleOpenDrawerButtonAction: {
        value: function () { this._toggleDrawer(); }
    },

    isDrawerOpen: {
        value: true
    }

});

