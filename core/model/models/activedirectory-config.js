var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.ActivedirectoryConfig = AbstractModel.specialize({
    _binddn: {
        value: null
    },
    binddn: {
        set: function (value) {
            if (this._binddn !== value) {
                this._binddn = value;
            }
        },
        get: function () {
            return this._binddn;
        }
    },
    _bindpw: {
        value: null
    },
    bindpw: {
        set: function (value) {
            if (this._bindpw !== value) {
                this._bindpw = value;
            }
        },
        get: function () {
            return this._bindpw;
        }
    },
    _domain: {
        value: null
    },
    domain: {
        set: function (value) {
            if (this._domain !== value) {
                this._domain = value;
            }
        },
        get: function () {
            return this._domain;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "binddn",
            valueType: "String"
        }, {
            mandatory: false,
            name: "bindpw",
            valueType: "String"
        }, {
            mandatory: false,
            name: "domain",
            valueType: "String"
        }]
    }
});
