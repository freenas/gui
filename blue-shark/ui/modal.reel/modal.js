var AbstractControl = require("montage/ui/base/abstract-control").AbstractControl,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

exports.Modal = AbstractControl.specialize({
    isShown: {
        value: false
    },

    templateDidLoad: {
        value: function() {
            this.super();
            this.isShown = false;
        }
    },

    enterDocument: {
        value: function() {
            this.element.addEventListener('click', this);
        }
    },

    // FIXME: not working??
    prepareForActivationEvents: {
        value: function() {
            KeyComposer.createKey(this, "enter", "enter").addEventListener("keyPress", this);
            KeyComposer.createKey(this, "escape", "escape").addEventListener("keyPress", this);
        }
    },

    close: {
        value: function() {
            this.isShown = false;
        }
    },

    toggle: {
        value: function() {
            this.isShown = !this.isShown;
        }
    },

    handleEscapeKeyPress: {
        value: function() {
            if (this.controller && typeof this.controller.handleCloseAction === 'function') {
                this.controller.handleCloseAction()
            } else {
                this.close();
            }
        }
    },

    handleClick: {
        value: function (e) {
            if(e.target == this.element) {
                if (this.controller && typeof this.controller.handleCloseAction === 'function') {
                    this.controller.handleCloseAction()
                } else {
                    this.close();
                }
            }
        }
    },

    handleCloseButtonAction: {
        value: function() {
            if (this.controller && typeof this.controller.handleCloseAction === 'function') {
                this.controller.handleCloseAction()
            } else {
                this.close();
            }
        }
    }
});
