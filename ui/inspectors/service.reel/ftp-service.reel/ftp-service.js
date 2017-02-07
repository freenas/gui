var Component = require("montage/ui/component").Component;

/**
 * @class FtpService
 * @extends Component
 */
exports.FtpService = Component.specialize({
    _handleOnlyAnonChange: {
        value: function() {
            if (!this.object.only_anonymous) {
                this.object.only_local = true;
            }
        }
    },

    _handleOnlyLocalChange: {
        value: function() {
            if (!this.object.only_local) {
                this.object.only_anonymous = true;
            }
        }
    },

    enterDocument: {
        value: function() {
            this.addPathChangeListener("object.only_anonymous", this, "_handleOnlyAnonChange");
            this.addPathChangeListener("object.only_local", this, "_handleOnlyLocalChange");
            console.log(this.object.filemask);
            console.log(this.object.dirmask);
            if (this.object.filemask) {
                this.filemaskModes = {
                    user: this.object.filemask.user,
                    group: this.object.filemask.group,
                    others: this.object.filemask.others
                };
                delete this.object.filemask.value;
            } else {
                this.filemaskModes = {
                    user: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    group: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    others: {
                        read: false,
                        write: false,
                        execute: false
                    }
                };
            }
            if (this.object.dirmask) {
                this.dirmaskModes = {
                    user: this.object.dirmask.user,
                    group: this.object.dirmask.group,
                    others: this.object.dirmask.others
                };
                delete this.object.dirmask.value;
            } else {
                this.dirmaskModes = {
                    user: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    group: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    others: {
                        read: false,
                        write: false,
                        execute: false
                    }
                };
            }
        }
    },

    save: {
        value: function() {
            this.object.filemask = this.filemaskModes;
            this.object.dirmask = this.dirmaskModes;
        }
    },

    exitDocument: {
        value: function() {
            if (this.getPathChangeDescriptor("object.only_anonymous", this)) {
                this.removePathChangeListener("object.only_anonymous", this);   
            }
            if (this.getPathChangeDescriptor("object.only_local", this)) {
                this.removePathChangeListener("object.only_local", this);   
            }
            this.filemaskModes = null;
            this.dirmaskModes = null;
        }
    },
});
