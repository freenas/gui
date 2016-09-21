var Montage = require("montage").Montage;

exports.Update = Montage.specialize({
    _check_auto: {
        value: null
    },
    check_auto: {
        set: function (value) {
            if (this._check_auto !== value) {
                this._check_auto = value;
            }
        },
        get: function () {
            return this._check_auto;
        }
    },
    _train: {
        value: null
    },
    train: {
        set: function (value) {
            if (this._train !== value) {
                this._train = value;
            }
        },
        get: function () {
            return this._train;
        }
    },
    _update_server: {
        value: null
    },
    update_server: {
        set: function (value) {
            if (this._update_server !== value) {
                this._update_server = value;
            }
        },
        get: function () {
            return this._update_server;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "check_auto",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "train",
            valueType: "String"
        }, {
            mandatory: false,
            name: "update_server",
            readOnly: true,
            valueType: "String"
        }]
    }
});
