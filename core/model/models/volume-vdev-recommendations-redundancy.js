var Montage = require("montage/core/core").Montage;
var VolumeVdevRecommendation = require("core/model/models/volume-vdev-recommendation").VolumeVdevRecommendation;

exports.VolumeVdevRecommendationsRedundancy = Montage.specialize({
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
            return this._redundancy || (this._redundancy = new VolumeVdevRecommendation());
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
            return this._speed || (this._speed = new VolumeVdevRecommendation());
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
            return this._storage || (this._storage = new VolumeVdevRecommendation());
        }
    }
});
