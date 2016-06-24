var Montage = require("montage/core/core").Montage;
var AlertEmitterEmail = require("core/model/models/alert-emitter-email").AlertEmitterEmail;

exports.AlertFilter = Montage.specialize({
    _emitter: {
        value: null
    },
    emitter: {
        set: function (value) {
            if (this._emitter !== value) {
                this._emitter = value;
            }
        },
        get: function () {
            return this._emitter;
        }
    },
    _id: {
        value: null
    },
    id: {
        set: function (value) {
            if (this._id !== value) {
                this._id = value;
            }
        },
        get: function () {
            return this._id;
        }
    },
    _parameters: {
        value: null
    },
    parameters: {
        set: function (value) {
            if (this._parameters !== value) {
                this._parameters = value;
            }
        },
        get: function () {
            return this._parameters || (this._parameters = new AlertEmitterEmail());
        }
    },
    _predicates: {
        value: null
    },
    predicates: {
        set: function (value) {
            if (this._predicates !== value) {
                this._predicates = value;
            }
        },
        get: function () {
            return this._predicates;
        }
    }
});
