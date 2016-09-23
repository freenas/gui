var Component = require("montage/ui/component").Component;

/**
 * @class MainSidebar
 * @extends Component
 */
exports.MainSidebar = Component.specialize({

    confirmationPromise: {
        value: null
    },

    confirmingAction: {
        value: null
    },

    confirmationMessage: {
        value: null
    },

    confirmationButtonLabel: {
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

    templateDidLoad: {
        value: function() {
            this._systemService = this.application.systemService;
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                if (!this.application.sessionService.session) {
                    this.application.sessionService.session = {
                        username: ''
                    };
                }

                this.session = this.application.sessionService.session;
            }
        }
    },

    handleRebootAction: {
        value: function () {
            var self = this;
            this._askConfirmation("Are you sure you want to reboot FreeNAS?", "Reboot").then(function(isConfirmed) {
                if (isConfirmed) {
                    self._systemService.reboot();
                }
            }).finally(function() {
                self._cleanupConfirmation();
            });
        }
    },

    handleShutdownAction: {
        value: function () {
            var self = this;
            this._askConfirmation("Are you sure you want to shutdown FreeNAS?", "Shutdown").then(function(isConfirmed) {
                if (isConfirmed) {
                    self._systemService.shutdown();
                }
            }).finally(function() {
                self._cleanupConfirmation()
            });
        }
    },

    handleLogoutAction: {
        value: function () {
            console.log("clicked");
            var self = this;
            this._askConfirmation("Are you sure you want to logout of FreeNAS?", "Logout").then(function(isConfirmed) {
                if (isConfirmed) {
                    location.reload();
                }
            }).finally(function() {
                self._cleanupConfirmation()
            });
        }
    },

    handleConfirmAction: {
        value: function() {
            if (this._confirmationDeferred) {
                this._confirmationDeferred.resolve(true);
            }
        }
    },

    handleCancelAction: {
        value: function() {
            if (this._confirmationDeferred) {
                this._confirmationDeferred.resolve(false);
            }
        }
    },

    _askConfirmation: {
        value: function(message, buttonLabel) {
            var self = this;
            this.confirmationMessage = message;
            this.confirmationButtonLabel = buttonLabel;
            return new Promise(function(resolve) {
                self._confirmationDeferred = {
                    resolve: resolve
                };
            });
        }
    },

    _cleanupConfirmation: {
        value: function() {
            this.confirmationMessage = null;
            this._confirmationDeferred = null;
        }
    }
});
