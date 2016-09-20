var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VolumeVdevRecommendationsStorageAnonymous = AbstractModel.specialize({
    _redundancy: {
        value: null
    },
    redundancy: {
        set: function (value) {
            if (this._redundancy !== value) {
                this._redundancy = value;
            }
        },
        get: function () {
            return this._redundancy;
        }
    },
    _speed: {
        value: null
    },
    speed: {
        set: function (value) {
            if (this._speed !== value) {
                this._speed = value;
            }
        },
        get: function () {
            return this._speed;
        }
    },
    _storage: {
        value: null
    },
    storage: {
        set: function (value) {
            if (this._storage !== value) {
                this._storage = value;
            }
        },
        get: function () {
            return this._storage;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "redundancy",
            valueObjectPrototypeName: "VolumeVdevRecommendation",
            valueType: "object"
        }, {
            mandatory: false,
            name: "speed",
            valueObjectPrototypeName: "VolumeVdevRecommendation",
            valueType: "object"
        }, {
            mandatory: false,
            name: "storage",
            valueObjectPrototypeName: "VolumeVdevRecommendation",
            valueType: "object"
        }]
    }
});
