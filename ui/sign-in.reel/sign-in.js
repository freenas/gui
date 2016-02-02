var AuthorizationPanel = require("montage-data/ui/authorization-panel.reel").AuthorizationPanel;


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

    handleSubmitAction: {
        value: function() {
            if (!this._isAuthenticating) {
                this.isAuthenticating = true;

                var self = this;

                this.dataService.loginWithCredentials(this.userName, this.password).then(function (authorization) {
                    self.authorizationManagerPanel.approveAuthorization(authorization);

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
