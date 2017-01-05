var Montage = require("montage").Montage;

exports.UserDelete = Montage.specialize({
    _delete_home_directory: {
        value: null
    },
    delete_home_directory: {
        set: function (value) {
            if (this._delete_home_directory !== value) {
                this._delete_home_directory = value;
            }
        },
        get: function () {
            return this._delete_home_directory;
        }
    },
    _delete_own_group: {
        value: null
    },
    delete_own_group: {
        set: function (value) {
            if (this._delete_own_group !== value) {
                this._delete_own_group = value;
            }
        },
        get: function () {
            return this._delete_own_group;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "delete_home_directory",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "delete_own_group",
            valueType: "boolean"
        }]
    }
});
