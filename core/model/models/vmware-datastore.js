var Montage = require("montage").Montage;

exports.VmwareDatastore = Montage.specialize({
    _free_space: {
        value: null
    },
    free_space: {
        set: function (value) {
            if (this._free_space !== value) {
                this._free_space = value;
            }
        },
        get: function () {
            return this._free_space;
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
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
        }
    },
    _virtual_machines: {
        value: null
    },
    virtual_machines: {
        set: function (value) {
            if (this._virtual_machines !== value) {
                this._virtual_machines = value;
            }
        },
        get: function () {
            return this._virtual_machines;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "free_space",
            valueType: "number"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "virtual_machines",
            valueType: "array"
        }]
    }
});
