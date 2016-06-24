var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.UiTransaction = AbstractModel.specialize({
    _identifier: {
        value: null
    },
    identifier: {
        set: function (value) {
            if (this._identifier !== value) {
                this._identifier = value;
            }
        },
        get: function () {
            return this._identifier;
        }
    },
    _sessions: {
        value: null
    },
    sessions: {
        set: function (value) {
            if (this._sessions !== value) {
                this._sessions = value;
            }
        },
        get: function () {
            return this._sessions;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "identifier",
            valueType: "String"
        }, {
            mandatory: false,
            name: "sessions",
            valueType: "array"
        }]
    }
});
