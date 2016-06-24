var Montage = require("montage/core/core").Montage;

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
});
