var Montage = require("montage/core/core").Montage;

exports.UpdateOps = Montage.specialize({
    _new_name: {
        value: null
    },
    new_name: {
        set: function (value) {
            if (this._new_name !== value) {
                this._new_name = value;
            }
        },
        get: function () {
            return this._new_name;
        }
    },
    _new_version: {
        value: null
    },
    new_version: {
        set: function (value) {
            if (this._new_version !== value) {
                this._new_version = value;
            }
        },
        get: function () {
            return this._new_version;
        }
    },
    _operation: {
        value: null
    },
    operation: {
        set: function (value) {
            if (this._operation !== value) {
                this._operation = value;
            }
        },
        get: function () {
            return this._operation;
        }
    },
    _previous_name: {
        value: null
    },
    previous_name: {
        set: function (value) {
            if (this._previous_name !== value) {
                this._previous_name = value;
            }
        },
        get: function () {
            return this._previous_name;
        }
    },
    _previous_version: {
        value: null
    },
    previous_version: {
        set: function (value) {
            if (this._previous_version !== value) {
                this._previous_version = value;
            }
        },
        get: function () {
            return this._previous_version;
        }
    }
});
