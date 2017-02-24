var Component = require("montage/ui/component").Component;

/**
 * @class TftpdService
 * @extends Component
 */
exports.TftpdService = Component.specialize({

    users: {
        value: null
    },

    templateDidLoad: {
        value: function () {
            var self = this;

            this.sectionService.listUsers().then(function(users) {
                self.users = users;
            });
        }
    },

    enterDocument: {
        value: function () {
            if (this.object.umask) {
                this.umaskModes = {
                    user: this.object.umask.user,
                    group: this.object.umask.group,
                    others: this.object.umask.others
                };
                delete this.object.umask.value;
            } else {
                this.umaskModes = {
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
            this.object.umask = this.umaskModes;
        }
    },

    exitDocument: {
        value: function() {
            this.umaskModes = null;
        }
    }
});
