var Component = require("montage/ui/component").Component;

exports.AfpService = Component.specialize({

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
    }

});
