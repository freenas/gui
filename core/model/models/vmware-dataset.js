var Montage = require("montage").Montage;

exports.VmwareDataset = Montage.specialize({
    _dataset: {
        value: null
    },
    dataset: {
        set: function (value) {
            if (this._dataset !== value) {
                this._dataset = value;
            }
        },
        get: function () {
            return this._dataset;
        }
    },
    _datastore: {
        value: null
    },
    datastore: {
        set: function (value) {
            if (this._datastore !== value) {
                this._datastore = value;
            }
        },
        get: function () {
            return this._datastore;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "dataset",
            valueType: "String"
        }, {
            mandatory: false,
            name: "datastore",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }]
    }
});
