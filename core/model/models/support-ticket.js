var Montage = require("montage").Montage;

exports.SupportTicket = Montage.specialize({
    _attachments: {
        value: null
    },
    attachments: {
        set: function (value) {
            if (this._attachments !== value) {
                this._attachments = value;
            }
        },
        get: function () {
            return this._attachments;
        }
    },
    _category: {
        value: null
    },
    category: {
        set: function (value) {
            if (this._category !== value) {
                this._category = value;
            }
        },
        get: function () {
            return this._category;
        }
    },
    _debug: {
        value: null
    },
    debug: {
        set: function (value) {
            if (this._debug !== value) {
                this._debug = value;
            }
        },
        get: function () {
            return this._debug;
        }
    },
    _description: {
        value: null
    },
    description: {
        set: function (value) {
            if (this._description !== value) {
                this._description = value;
            }
        },
        get: function () {
            return this._description;
        }
    },
    _password: {
        value: null
    },
    password: {
        set: function (value) {
            if (this._password !== value) {
                this._password = value;
            }
        },
        get: function () {
            return this._password;
        }
    },
    _subject: {
        value: null
    },
    subject: {
        set: function (value) {
            if (this._subject !== value) {
                this._subject = value;
            }
        },
        get: function () {
            return this._subject;
        }
    },
    _type: {
        value: null
    },
    type: {
        set: function (value) {
            if (this._type !== value) {
                this._type = value;
            }
        },
        get: function () {
            return this._type;
        }
    },
    _username: {
        value: null
    },
    username: {
        set: function (value) {
            if (this._username !== value) {
                this._username = value;
            }
        },
        get: function () {
            return this._username;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: true,
            name: "attachments",
            valueType: "array"
        }, {
            mandatory: true,
            name: "category",
            valueType: "String"
        }, {
            mandatory: true,
            name: "debug",
            valueType: "boolean"
        }, {
            mandatory: true,
            name: "description",
            valueType: "String"
        }, {
            mandatory: true,
            name: "password",
            valueType: "String"
        }, {
            mandatory: true,
            name: "subject",
            valueType: "String"
        }, {
            mandatory: true,
            name: "type",
            valueType: "String"
        }, {
            mandatory: false,
            name: "username",
            valueType: "String"
        }]
    }
});
