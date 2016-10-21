var Montage = require("montage").Montage;

exports.Peer = Montage.specialize({
    _credentials: {
        value: null
    },
    credentials: {
        set: function (value) {
            if (this._credentials !== value) {
                this._credentials = value;
            }
        },
        get: function () {
            return this._credentials;
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
    _status: {
        value: null
    },
    status: {
        set: function (value) {
            if (this._status !== value) {
                this._status = value;
            }
        },
        get: function () {
            return this._status;
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
            name: "credentials",
            valueObjectPrototypeName: "PeerCredentials",
            valueType: "object"
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
            name: "status",
            valueObjectPrototypeName: "PeerStatus",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Peers'",
            inspectorComponentModule: {
                id: 'ui/sections/peering/inspectors/peer.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/peering/inspectors/peer.reel'
            },
            nameExpression: "!_isNew && name.defined() ? name : !!type ? 'Create a new ' + type + ' peer' : 'Create a peer'"
        }
    }
});
