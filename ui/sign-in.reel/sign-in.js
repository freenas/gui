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

    handleSubmitAction: {
        value: function() {

            var promise = this.dataService.loginWithCredentials(this.userName, this.password).then(function(authorization){
                this.authorizationManagerPanel.approveAuthorization(authorization);
            }, function(error) {
                this.authorizationManagerPanel.cancelAuthorization(error);
            });
        }
    }

});
