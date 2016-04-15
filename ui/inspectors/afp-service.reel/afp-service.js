var Component = require("montage/ui/component").Component;

/**
 * @class AfpService
 * @extends Component
 */
exports.AfpService = Component.specialize({
    _users: {
        value: [
            {
                "id": "68E21C39-85B7-4FBC-875F-78EBB4701B83",
                "uid": 53,
                "sudo": false,
                "groups": [],
                "home": "/",
                "created_at": {},
                "group": "FD259280-436B-45A6-B5AC-52BFAD816019",
                "smbhash": "*",
                "locked": false,
                "email": null,
                "full_name": "Bind Sandbox",
                "updated_at": {},
                "shell": "/usr/sbin/nologin",
                "builtin": true,
                "password_disabled": false,
                "sshpubkey": null,
                "unixhash": "*",
                "username": "bind",
                "attributes": {}
            },
            {
                "attributes": {},
                "uid": 65534,
                "full_name": "Unprivileged user",
                "sshpubkey": null,
                "email": null,
                "shell": "/usr/sbin/nologin",
                "locked": false,
                "unixhash": "*",
                "created_at": {},
                "smbhash": "*",
                "builtin": true,
                "id": "94248344-2453-4523-A0D9-1A128897FBE2",
                "groups": [],
                "group": "AE3500A4-C5FD-41D1-BDD7-6831A9D1E4AA",
                "sudo": false,
                "updated_at": {},
                "password_disabled": false,
                "username": "nobody",
                "home": "/nonexistent"
            }
        ]
    },

    users: {
        get: function() {
            return this._users;
        }
    }
});
