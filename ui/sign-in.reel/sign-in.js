var AuthorizationPanel = require("montage-data/ui/authorization-panel.reel").AuthorizationPanel;

// ModalOverlay.prototype.enterDocument = Overlay.prototype.enterDocument;
// ModalOverlay.prototype.draw = Overlay.prototype.draw;

/**
 * @class SignIn
 * @extends Component
 */
exports.SignIn = AuthorizationPanel.specialize({

    // $fix - for development purpose
    // enterDocument: {
    //     value: function (firsTime) {
    //         Overlay.prototype.enterDocument.call(this, firsTime);

    //         if (firsTime) {
    //             this.show();
    //         }
    //     }
    // },
    "userName": {
        value: void 0
    },
    "password": {
        value: void 0
    },
    handleSubmitAction: {
        value: function() {

            var promise = this.dataService.loginWithCredentials(this.userName, this.password).then(function(authorization){
                this.authorizationManagerPanel.approveAuthorization(authorization);
            }, function(error) {
                this.authorizationManagerPanel.cancelAuthorization(error);
            });

            //this.hide();
        }
    }


});
