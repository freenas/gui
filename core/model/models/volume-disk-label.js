var Montage = require("montage").Montage;

exports.VolumeDiskLabel = Montage.specialize({
    _hostid: {
        value: null
    },
    hostid: {
        set: function (value) {
            if (this._hostid !== value) {
                this._hostid = value;
            }
        },
        get: function () {
            return this._hostid;
        }
    },
    _hostname: {
        value: null
    },
    hostname: {
        set: function (value) {
            if (this._hostname !== value) {
                this._hostname = value;
            }
        },
        get: function () {
            return this._hostname;
        }
    },
    _vdev_guid: {
        value: null
    },
    vdev_guid: {
        set: function (value) {
            if (this._vdev_guid !== value) {
                this._vdev_guid = value;
            }
        },
        get: function () {
            return this._vdev_guid;
        }
    },
    _volume_guid: {
        value: null
    },
    volume_guid: {
        set: function (value) {
            if (this._volume_guid !== value) {
                this._volume_guid = value;
            }
        },
        get: function () {
            return this._volume_guid;
        }
    },
    _volume_id: {
        value: null
    },
    volume_id: {
        set: function (value) {
            if (this._volume_id !== value) {
                this._volume_id = value;
            }
        },
        get: function () {
            return this._volume_id;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "hostid",
            valueType: "number"
        }, {
            mandatory: false,
            name: "hostname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "vdev_guid",
            valueType: "String"
        }, {
            mandatory: false,
            name: "volume_guid",
            valueType: "String"
        }, {
            mandatory: false,
            name: "volume_id",
            valueType: "String"
        }]
    }
});
