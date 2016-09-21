var Component = require("montage/ui/component").Component;

/**
 * @class MainSidebar
 * @extends Component
 */
exports.MainSidebar = Component.specialize({

    confirmingAction: {
        value: null
    },

    confirmationMessage: {
        value: null
    },

    isFlipped: {
        value: false
    },

    handleLogoButtonAction: {
        value: function () {
            if (this.isFlipped) {
                window.open('https://www.ixsystems.com/','_blank');
            } else {
                window.open('http://www.freenas.org','_blank');
            }
            this.isFlipped = !this.isFlipped;
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                if (!this.application.sessionService.session) {
                    this.application.sessionService.session = {
                        username: '',
                    };
                }

                this.session = this.application.sessionService.session;
            }
        }
    },

    handleRebootAction: {
        value: function () {
            this.confirmingAction = "reboot";
            this.confirmationMessage = "Are you sure you want to reboot FreeNAS?";
        }
    },

    handleShutdownAction: {
        value: function () {
            this.confirmingAction = "shutdown";
            this.confirmationMessage = "Are you sure you want to shut down FreeNAS?";
        }
    },

    handleLogoutAction: {
        value: function () {
            this.confirmingAction = "logout";
            this.confirmationMessage = "Are you sure you want to log out of FreeNAS?";
        }
    },

    handleConfirmAction: {
        value: function() {
            switch (this.confirmingAction) {
                case "reboot":
                    this.reboot();
                    break;

                case "shutdown":
                    this.shutdown();
                    break;

                case "logout":
                    this.logout();
                    break;

                default:
                    console.warning("Tried to confirm unknown power or logout action.");
            }
        }
    },

    reboot: {
        value: function () {
            this.confirmingAction = null;
            this.application.systemService.reboot();
        }
    },

    shutdown: {
        value: function () {
            this.confirmingAction = null;
            this.application.systemService.shutdown();
        }
    },

    logout: {
        value: function () {
            this.confirmingAction = null;
            location.reload();
        }
    }
});
