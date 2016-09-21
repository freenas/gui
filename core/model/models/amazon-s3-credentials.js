var Montage = require("montage").Montage;

exports.AmazonS3Credentials = Montage.specialize({
    _access_key: {
        value: null
    },
    access_key: {
        set: function (value) {
            if (this._access_key !== value) {
                this._access_key = value;
            }
        },
        get: function () {
            return this._access_key;
        }
    },
    _bucket: {
        value: null
    },
    bucket: {
        set: function (value) {
            if (this._bucket !== value) {
                this._bucket = value;
            }
        },
        get: function () {
            return this._bucket;
        }
    },
    _folder: {
        value: null
    },
    folder: {
        set: function (value) {
            if (this._folder !== value) {
                this._folder = value;
            }
        },
        get: function () {
            return this._folder;
        }
    },
    _region: {
        value: null
    },
    region: {
        set: function (value) {
            if (this._region !== value) {
                this._region = value;
            }
        },
        get: function () {
            return this._region;
        }
    },
    _secret_key: {
        value: null
    },
    secret_key: {
        set: function (value) {
            if (this._secret_key !== value) {
                this._secret_key = value;
            }
        },
        get: function () {
            return this._secret_key;
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
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "access_key",
            valueType: "String"
        }, {
            mandatory: false,
            name: "bucket",
            valueType: "String"
        }, {
            mandatory: false,
            name: "folder",
            valueType: "String"
        }, {
            mandatory: false,
            name: "region",
            valueType: "String"
        }, {
            mandatory: false,
            name: "secret_key",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
