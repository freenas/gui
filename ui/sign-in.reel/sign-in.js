var ModalOverlay = require("montage/ui/modal-overlay.reel").ModalOverlay,
    Overlay = require("montage/ui/overlay.reel").Overlay;

ModalOverlay.prototype.enterDocument = Overlay.prototype.enterDocument;
ModalOverlay.prototype.draw = Overlay.prototype.draw;

/**
 * @class SignIn
 * @extends Component
 */
exports.SignIn = ModalOverlay.specialize({

    // $fix - for development purpose
    // enterDocument: {
    //     value: function (firsTime) {
    //         Overlay.prototype.enterDocument.call(this, firsTime);

    //         if (firsTime) {
    //             this.show();
    //         }
    //     }
    // },

    handleSubmitAction: {
        value: function() {
            this.hide();
        }
    }

});
