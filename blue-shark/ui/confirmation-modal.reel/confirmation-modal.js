var Component = require("montage/ui/component").Component;

exports.ConfirmationModal = Component.specialize({

    handleFalseButtonAction: {
        value: function(event) {
            if (this.deferred && typeof this.deferred.resolve === 'function') {
                this.deferred.resolve(false);
            }
            this.modal.close();
            event.stopPropagation();
        }
    },

    handleTrueButtonAction: {
        value: function(event) {
            if (this.deferred && typeof this.deferred.resolve === 'function') {
                this.deferred.resolve({
                });
            }
            this.modal.close();
            event.stopPropagation();
        }
    },

    handleCloseAction: {
        value: function() {
            if (this.deferred && typeof this.deferred.resolve === 'function') {
                this.deferred.resolve({});
            }
            this.modal.close();
            event.stopPropagation();
        }
    }
});
