var Montage = require("montage").Montage;

exports.VmTemplateSource = Montage.specialize({
    _driver: {
        value: null
    },
    driver: {
        set: function (value) {
            if (this._driver !== value) {
                this._driver = value;
            }
        },
        get: function () {
            return this._driver;
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
    _url: {
        value: null
    },
    url: {
        set: function (value) {
            if (this._url !== value) {
                this._url = value;
            }
        },
        get: function () {
            return this._url;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "driver",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "url",
            valueType: "String"
        }]
    }
});
