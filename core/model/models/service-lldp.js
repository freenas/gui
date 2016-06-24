var Montage = require("montage/core/core").Montage;

exports.ServiceLldp = Montage.specialize({
    _country_code: {
        value: null
    },
    country_code: {
        set: function (value) {
            if (this._country_code !== value) {
                this._country_code = value;
            }
        },
        get: function () {
            return this._country_code;
        }
    },
    _enable: {
        value: null
    },
    enable: {
        set: function (value) {
            if (this._enable !== value) {
                this._enable = value;
            }
        },
        get: function () {
            return this._enable;
        }
    },
    _location: {
        value: null
    },
    location: {
        set: function (value) {
            if (this._location !== value) {
                this._location = value;
            }
        },
        get: function () {
            return this._location;
        }
    },
    _save_description: {
        value: null
    },
    save_description: {
        set: function (value) {
            if (this._save_description !== value) {
                this._save_description = value;
            }
        },
        get: function () {
            return this._save_description;
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
    }
});
