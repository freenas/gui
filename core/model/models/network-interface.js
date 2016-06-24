var Montage = require("montage/core/core").Montage;
var NetworkInterfaceStatus = require("core/model/models/network-interface-status").NetworkInterfaceStatus;

exports.NetworkInterface = Montage.specialize({
    _aliases: {
        value: null
    },
    aliases: {
        set: function (value) {
            if (this._aliases !== value) {
                this._aliases = value;
            }
        },
        get: function () {
            return this._aliases;
        }
    },
    _bridge: {
        value: null
    },
    bridge: {
        set: function (value) {
            if (this._bridge !== value) {
                this._bridge = value;
            }
        },
        get: function () {
            return this._bridge;
        }
    },
    _capabilities: {
        value: null
    },
    capabilities: {
        set: function (value) {
            if (this._capabilities !== value) {
                this._capabilities = value;
            }
        },
        get: function () {
            return this._capabilities;
        }
    },
    _created_at: {
        value: null
    },
    created_at: {
        set: function (value) {
            if (this._created_at !== value) {
                this._created_at = value;
            }
        },
        get: function () {
            return this._created_at;
        }
    },
    _dhcp: {
        value: null
    },
    dhcp: {
        set: function (value) {
            if (this._dhcp !== value) {
                this._dhcp = value;
            }
        },
        get: function () {
            return this._dhcp;
        }
    },
    _enabled: {
        value: null
    },
    enabled: {
        set: function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
            }
        },
        get: function () {
            return this._enabled;
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
    _lagg: {
        value: null
    },
    lagg: {
        set: function (value) {
            if (this._lagg !== value) {
                this._lagg = value;
            }
        },
        get: function () {
            return this._lagg;
        }
    },
    _media: {
        value: null
    },
    media: {
        set: function (value) {
            if (this._media !== value) {
                this._media = value;
            }
        },
        get: function () {
            return this._media;
        }
    },
    _mediaopts: {
        value: null
    },
    mediaopts: {
        set: function (value) {
            if (this._mediaopts !== value) {
                this._mediaopts = value;
            }
        },
        get: function () {
            return this._mediaopts;
        }
    },
    _mtu: {
        value: null
    },
    mtu: {
        set: function (value) {
            if (this._mtu !== value) {
                this._mtu = value;
            }
        },
        get: function () {
            return this._mtu;
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
    _noipv6: {
        value: null
    },
    noipv6: {
        set: function (value) {
            if (this._noipv6 !== value) {
                this._noipv6 = value;
            }
        },
        get: function () {
            return this._noipv6;
        }
    },
    _rtadv: {
        value: null
    },
    rtadv: {
        set: function (value) {
            if (this._rtadv !== value) {
                this._rtadv = value;
            }
        },
        get: function () {
            return this._rtadv;
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
            return this._status || (this._status = new NetworkInterfaceStatus());
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
    },
    _updated_at: {
        value: null
    },
    updated_at: {
        set: function (value) {
            if (this._updated_at !== value) {
                this._updated_at = value;
            }
        },
        get: function () {
            return this._updated_at;
        }
    },
    _vlan: {
        value: null
    },
    vlan: {
        set: function (value) {
            if (this._vlan !== value) {
                this._vlan = value;
            }
        },
        get: function () {
            return this._vlan;
        }
    }
});
