var Component = require("montage/ui/component").Component,
    EventDispatcherService = require('core/service/event-dispatcher-service').EventDispatcherService,
    SystemService = require('core/service/system-service').SystemService,
    Events = require('core/Events').Events;

exports.MainSidebar = Component.specialize({

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
            this.eventDispatcherService = EventDispatcherService.getInstance();
            this._systemService = SystemService.getInstance();
            this.eventDispatcherService.addEventListener(Events.sessionOpened, this._handleSessionOpened.bind(this))
        }
    },

    handleRebootAction: {
        value: function () {
            var self = this;
            this._askConfirmation("Reboot").then(function(isConfirmed) {
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
            this._askConfirmation("Shutdown").then(function(isConfirmed) {
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
            var self = this;
            this._askConfirmation("Logout").then(function(isConfirmed) {
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

    _handleSessionOpened: {
        value: function(session) {
            this.session = session;
        }
    },

    _askConfirmation: {
        value: function(action) {
            var self = this;
            this.confirmationMessage = "Are you sure you want to " + action.toLowerCase() + " FreeNAS?";
            this.confirmationButtonLabel = action;
            return new Promise(function(resolve) {
                self._confirmationDeferred = {
                    resolve: resolve
                };
            });
        }
    },

    _cleanupConfirmation: {
        value: function() {
            this._confirmationDeferred = null;

        }
    }
});
