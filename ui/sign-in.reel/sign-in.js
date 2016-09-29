var AuthorizationPanel = require("montage-data/ui/authorization-panel.reel").AuthorizationPanel,
    Model = require("core/model/model").Model,
    currentEnvironment = require("montage/core/environment").currentEnvironment,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;


/**
 * @class SignIn
 * @extends Component
 */
var SignIn = exports.SignIn = AuthorizationPanel.specialize({

    userName: {
        value: void 0
    },

    password: {
        value: void 0
    },

    isBrowserSupported: {
        get: function () {
            return currentEnvironment.browserName == 'chrome';
        }
    },

    submitButton: {
        value: void 0
    },

    passwordTextField: {
        value: void 0
    },

    userNameTextField: {
        value: void 0
    },

    hasError: {
        value: false
    },

    _errorMessage: {
        value: null
    },

    errorMessage: {
        get: function () {
            return this._errorMessage;
        },
        set: function (errorMessage) {
            this._errorMessage = errorMessage;
            this.hasError = !!errorMessage;
        }
    },

    _isAuthenticating: {
        value: false
    },

    isAuthenticating: {
        set: function (isAuthenticating) {
            if (this._isAuthenticating !== isAuthenticating) {
                this._isAuthenticating = isAuthenticating;
                this._toggleUserInteraction();
            }
        },
        get: function () {
            return this._isAuthenticating;
        }
    },


    __keyComposer: {
        value: null
    },

    _keyComposer: {
        get: function () {
            if (!this.__keyComposer) {
                this.__keyComposer = new KeyComposer();
                this.__keyComposer.keys = "enter";
                this.__keyComposer.identifier = "enter";
                this.addComposerForElement(this.__keyComposer, this.element.ownerDocument.defaultView);
            }

            return this.__keyComposer;
        }
    },

    enterDocument: {
        value: function () {
            this.addEventListener("action", this, false);
            this._keyComposer.addEventListener("keyPress", this, false);
        }
    },

    exitDocument: {
        value: function () {
            this.removeEventListener("action", this, false);
            this._keyComposer.removeEventListener("keyPress", this, false);
        }
    },


    handleKeyPress: {
        value: function (event) {
            if (event.identifier === "enter") {
                this.handleSubmitAction();
            }
        }
    },


    handleSubmitAction: {
        value: function() {
            if (!this._isAuthenticating && this.userName && this.password) {
                var self = this;
                this.isAuthenticating = true;
                this.errorMessage = null;

                this.dataService.loginWithCredentials(this.userName, this.password).then(function (authorization) {
                    self.authorizationManagerPanel.approveAuthorization(authorization);
                    self.application.sessionService.sessionDidOpen(self.userName);

                    // Don't keep any track of the password in memory.
                    self.password = self.userName = null;

                    //FIXME: kind of hacky
                    self.application.dispatchEventNamed("userLogged");
//                    self.application.section = self._getSection();

                }, function (error) {
                    self.errorMessage = error.message || error;
                }).finally(function () {
                    if (self.errorMessage) {
                        self.element.addEventListener(
                            typeof WebKitAnimationEvent !== "undefined" ? "webkitAnimationEnd" : "animationend", self, false
                        );
                    }

                    self.isAuthenticating = false;
                });
            }
        }
    },

    handleAnimationend: {
        value: function () {
            if (this.errorMessage) {
                this.passwordTextField.value = null;
                this.passwordTextField.element.focus();

                this.element.removeEventListener(
                    typeof WebKitAnimationEvent !== "undefined" ? "webkitAnimationEnd" : "animationend", this, false
                );
            }
        }
    },

    _getSection: {
        value: function() {
            var defaultSection = 'dashboard',
                hashParts = window.location.hash.replace('#!', '').split('&'),
                keyValue,
                args = {};
            for (var i = 0, length = hashParts.length; i < length; i++) {
                keyValue = hashParts[i].split('=');
                args[keyValue[0]] = keyValue[1];
            }
            if (args.section && args.section !== '') {
                return args.section;
            }
            return defaultSection;
        }
    },

    _toggleUserInteraction: {
        value: function () {
            this.submitButton.disabled = this._isAuthenticating;
            this.passwordTextField.enabled = this.userNameTextField.enabled = !this._isAuthenticating;
        }
    }

});

SignIn.prototype.handleWebkitAnimationEnd = SignIn.prototype.handleAnimationend;
