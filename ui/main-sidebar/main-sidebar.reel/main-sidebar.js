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
            this.application.systemService.reboot();
        }
    },

    handleShutdownAction: {
        value: function () {
            this.application.systemService.shutdown();
        }
    },

    handleLogoutAction: {
        value: function () {
            location.reload();
        }
    }
});
