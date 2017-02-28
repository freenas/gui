var AbstractShareInspector = require("../abstract-share-inspector").AbstractShareInspector;

exports.NfsShare = AbstractShareInspector.specialize({

    securityOptions: {
        value: [
            "sys",
            "krb5",
            "krb5i",
            "krb5p"
        ]
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this._sectionService.listUsers().then(function(users) {
                self.users = users;
            });
            this._sectionService.listGroups().then(function(groups) {
                self.groups = groups;
            });
        }
    }
});
