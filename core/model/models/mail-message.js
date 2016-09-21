var Montage = require("montage").Montage;

exports.MailMessage = Montage.specialize({
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
    _extra_headers: {
        value: null
    },
    extra_headers: {
        set: function (value) {
            if (this._extra_headers !== value) {
                this._extra_headers = value;
            }
        },
        get: function () {
            return this._extra_headers;
        }
    },
    _from: {
        value: null
    },
    from: {
        set: function (value) {
            if (this._from !== value) {
                this._from = value;
            }
        },
        get: function () {
            return this._from;
        }
    },
    _message: {
        value: null
    },
    message: {
        set: function (value) {
            if (this._message !== value) {
                this._message = value;
            }
        },
        get: function () {
            return this._message;
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
    _to: {
        value: null
    },
    to: {
        set: function (value) {
            if (this._to !== value) {
                this._to = value;
            }
        },
        get: function () {
            return this._to;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "attachments",
            valueType: "array"
        }, {
            mandatory: false,
            name: "extra_headers",
            valueType: "object"
        }, {
            mandatory: false,
            name: "from",
            valueType: "String"
        }, {
            mandatory: false,
            name: "message",
            valueType: "String"
        }, {
            mandatory: false,
            name: "subject",
            valueType: "String"
        }, {
            mandatory: false,
            name: "to",
            valueType: "array"
        }]
    }
});
