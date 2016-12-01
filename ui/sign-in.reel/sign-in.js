var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    currentEnvironment = require("montage/core/environment").currentEnvironment,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;


var SignIn = exports.SignIn = Component.specialize({

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

    hadError: {
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
        value: function (isFirstTime) {
            this.addEventListener("action", this, false);
            this._keyComposer.addEventListener("keyPress", this, false);

            // checks for disconnected hash
            if(window.location.href.indexOf(";disconnected") > -1) {
                this.hasError = true;
                this.errorMessage = "Oops! Your token has been expired. \n Please re-login.";
                history.pushState('', document.title, window.location.href.replace(/;disconnected/g, ''));
            }
            this.userNameTextField.focus();
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
            if (!this._isAuthenticating && this.userName) {
                var self = this;
                this.isAuthenticating = true;
                this.hadError = false;
                var password = this.password || "";

                this.application.dataService.loginWithCredentials(this.userName, password).then(function () {
                    self.isLoggedIn = true;
                    self.application.applicationModal.hide(self);
                    self.application.sessionService.sessionDidOpen(self.userName);

                    // Don't keep any track of the password in memory.
                    self.password = self.userName = null;

                    //FIXME: kind of hacky
                    self.application.dispatchEventNamed("userLogged");

                }, function (error) {
                        if(error) {
                            self.errorMessage = error.message || error;
                            self.hadError = true;
                        } else {
                            self.errorMessage = null;
                        }
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

    _toggleUserInteraction: {
        value: function () {
            this.submitButton.disabled = this._isAuthenticating;
            this.passwordTextField.disabled = this.userNameTextField.disabled = this._isAuthenticating;
        }
    }

});

SignIn.prototype.handleWebkitAnimationEnd = SignIn.prototype.handleAnimationend;
