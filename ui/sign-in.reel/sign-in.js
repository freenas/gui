var AuthorizationPanel = require("montage-data/ui/authorization-panel.reel").AuthorizationPanel,
    Model = require("core/model/model").Model,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;


/**
 * @class SignIn
 * @extends Component
 */
exports.SignIn = AuthorizationPanel.specialize({

    userName: {
        value: void 0
    },

    password: {
        value: void 0
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
        value: function (mutableEvent) {
            //Fixme: bug?
            if (mutableEvent._event.identifier === "enter") {
                this.handleSubmitAction();
            }
        }
    },


    handleSubmitAction: {
        value: function() {
            if (!this._isAuthenticating && this.userName && this.password) {
                var self = this;
                this.isAuthenticating = true;

                this.dataService.loginWithCredentials(this.userName, this.password).then(function (authorization) {
                    self.authorizationManagerPanel.approveAuthorization(authorization);

                    // Don't keep any track of the password in memory.
                    self.password = self.userName = null;

                    self.application.section = 'dashboard';
                    return self.application.dataService.fetchData(Model.Service).then(function(services) {
                        return Promise.all(services.map(function(x) { return Promise.resolve(x.config).then(function() { return x; }); }));
                    });
                }, function (error) {
                    self.errorMessage = error.message || error;

                }).finally(function () {
                    self.isAuthenticating = false;
                });
            }
        }
    },

    _toggleUserInteraction: {
        value: function () {
            this.submitButton.enabled =
                this.passwordTextField.enabled =
                    this.userNameTextField.enabled = !this._isAuthenticating;
        }
    }

});
