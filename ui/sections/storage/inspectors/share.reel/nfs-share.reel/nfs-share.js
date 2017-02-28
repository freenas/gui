var AbstractShareInspector = require("../abstract-share-inspector").AbstractShareInspector;

exports.NfsShare = AbstractShareInspector.specialize({

    securityOptions: {
        value: [
            "sys",
            "krb5",
            "krb5i",
            "krb5p"
        ]
    }

});
