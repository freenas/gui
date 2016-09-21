var Montage = require("montage").Montage;

exports.UpdateTrain = Montage.specialize({
    _current: {
        value: null
    },
    current: {
        set: function (value) {
            if (this._current !== value) {
                this._current = value;
            }
        },
        get: function () {
            return this._current;
        }
    },
    _description: {
        value: null
    },
    description: {
        set: function (value) {
            if (this._description !== value) {
                this._description = value;
            }
        },
        get: function () {
            return this._description;
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
    _sequence: {
        value: null
    },
    sequence: {
        set: function (value) {
            if (this._sequence !== value) {
                this._sequence = value;
            }
        },
        get: function () {
            return this._sequence;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "current",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "sequence",
            valueType: "String"
        }]
    }
});
