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
            if (!this._isAuthenticating && this.userName && this.password) {
                this.isAuthenticating = true;

                this.dataService.loginWithCredentials(this.userName, this.password).bind(this).then(function (authorization) {
                    this.authorizationManagerPanel.approveAuthorization(authorization);

                    // Don't keep any track of the password in memory.
                    this.password = this.userName = null;

                }, function (error) {
                    this.errorMessage = error.message || error;

                }).finally(function () {
                    this.isAuthenticating = false;
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
