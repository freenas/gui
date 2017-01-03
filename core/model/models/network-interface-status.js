var Montage = require("montage").Montage;

exports.NetworkInterfaceStatus = Montage.specialize({
    _active_media_subtype: {
        value: null
    },
    active_media_subtype: {
        set: function (value) {
            if (this._active_media_subtype !== value) {
                this._active_media_subtype = value;
            }
        },
        get: function () {
            return this._active_media_subtype;
        }
    },
    _active_media_type: {
        value: null
    },
    active_media_type: {
        set: function (value) {
            if (this._active_media_type !== value) {
                this._active_media_type = value;
            }
        },
        get: function () {
            return this._active_media_type;
        }
    },
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
    _cloned: {
        value: null
    },
    cloned: {
        set: function (value) {
            if (this._cloned !== value) {
                this._cloned = value;
            }
        },
        get: function () {
            return this._cloned;
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
    _flags: {
        value: null
    },
    flags: {
        set: function (value) {
            if (this._flags !== value) {
                this._flags = value;
            }
        },
        get: function () {
            return this._flags;
        }
    },
    _link_address: {
        value: null
    },
    link_address: {
        set: function (value) {
            if (this._link_address !== value) {
                this._link_address = value;
            }
        },
        get: function () {
            return this._link_address;
        }
    },
    _link_state: {
        value: null
    },
    link_state: {
        set: function (value) {
            if (this._link_state !== value) {
                this._link_state = value;
            }
        },
        get: function () {
            return this._link_state;
        }
    },
    _media_options: {
        value: null
    },
    media_options: {
        set: function (value) {
            if (this._media_options !== value) {
                this._media_options = value;
            }
        },
        get: function () {
            return this._media_options;
        }
    },
    _media_subtype: {
        value: null
    },
    media_subtype: {
        set: function (value) {
            if (this._media_subtype !== value) {
                this._media_subtype = value;
            }
        },
        get: function () {
            return this._media_subtype;
        }
    },
    _media_type: {
        value: null
    },
    media_type: {
        set: function (value) {
            if (this._media_type !== value) {
                this._media_type = value;
            }
        },
        get: function () {
            return this._media_type;
        }
    },
    _members: {
        value: null
    },
    members: {
        set: function (value) {
            if (this._members !== value) {
                this._members = value;
            }
        },
        get: function () {
            return this._members;
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
    _nd6_flags: {
        value: null
    },
    nd6_flags: {
        set: function (value) {
            if (this._nd6_flags !== value) {
                this._nd6_flags = value;
            }
        },
        get: function () {
            return this._nd6_flags;
        }
    },
    _parent: {
        value: null
    },
    parent: {
        set: function (value) {
            if (this._parent !== value) {
                this._parent = value;
            }
        },
        get: function () {
            return this._parent;
        }
    },
    _ports: {
        value: null
    },
    ports: {
        set: function (value) {
            if (this._ports !== value) {
                this._ports = value;
            }
        },
        get: function () {
            return this._ports;
        }
    },
    _supported_media: {
        value: null
    },
    supported_media: {
        set: function (value) {
            if (this._supported_media !== value) {
                this._supported_media = value;
            }
        },
        get: function () {
            return this._supported_media;
        }
    },
    _tag: {
        value: null
    },
    tag: {
        set: function (value) {
            if (this._tag !== value) {
                this._tag = value;
            }
        },
        get: function () {
            return this._tag;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "active_media_subtype",
            valueType: "String"
        }, {
            mandatory: false,
            name: "active_media_type",
            valueType: "String"
        }, {
            mandatory: false,
            name: "aliases",
            valueObjectPrototypeName: "NetworkInterfaceAlias",
            valueType: "array"
        }, {
            mandatory: false,
            name: "capabilities",
            valueObjectPrototypeName: "NetworkInterfaceCapabilities",
            valueType: "object"
        }, {
            mandatory: false,
            name: "cloned",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "dhcp",
            valueType: "object"
        }, {
            mandatory: false,
            name: "flags",
            valueObjectPrototypeName: "NetworkInterfaceFlags",
            valueType: "object"
        }, {
            mandatory: false,
            name: "link_address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "link_state",
            valueObjectPrototypeName: "NetworkInterfaceStatusLinkstate",
            valueType: "object"
        }, {
            mandatory: false,
            name: "media_options",
            valueObjectPrototypeName: "NetworkInterfaceMediaopts",
            valueType: "object"
        }, {
            mandatory: false,
            name: "media_subtype",
            valueType: "String"
        }, {
            mandatory: false,
            name: "media_type",
            valueType: "String"
        }, {
            mandatory: false,
            name: "members",
            valueType: "array"
        }, {
            mandatory: false,
            name: "mtu",
            valueType: "number"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "nd6_flags",
            valueObjectPrototypeName: "NetworkInterfaceNd6Flag",
            valueType: "array"
        }, {
            mandatory: false,
            name: "parent",
            valueType: "String"
        }, {
            mandatory: false,
            name: "ports",
            valueType: "array"
        }, {
            mandatory: false,
            name: "supported_media",
            valueType: "array"
        }, {
            mandatory: false,
            name: "tag",
            valueType: "number"
        }]
    }
});
