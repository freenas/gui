var Montage = require("montage").Montage;

exports.AclEntryPerms = Montage.specialize({
    _ADD_FILE: {
        value: null
    },
    ADD_FILE: {
        set: function (value) {
            if (this._ADD_FILE !== value) {
                this._ADD_FILE = value;
            }
        },
        get: function () {
            return this._ADD_FILE;
        }
    },
    _ADD_SUBDIRECTORY: {
        value: null
    },
    ADD_SUBDIRECTORY: {
        set: function (value) {
            if (this._ADD_SUBDIRECTORY !== value) {
                this._ADD_SUBDIRECTORY = value;
            }
        },
        get: function () {
            return this._ADD_SUBDIRECTORY;
        }
    },
    _APPEND_DATA: {
        value: null
    },
    APPEND_DATA: {
        set: function (value) {
            if (this._APPEND_DATA !== value) {
                this._APPEND_DATA = value;
            }
        },
        get: function () {
            return this._APPEND_DATA;
        }
    },
    _DELETE: {
        value: null
    },
    DELETE: {
        set: function (value) {
            if (this._DELETE !== value) {
                this._DELETE = value;
            }
        },
        get: function () {
            return this._DELETE;
        }
    },
    _DELETE_CHILD: {
        value: null
    },
    DELETE_CHILD: {
        set: function (value) {
            if (this._DELETE_CHILD !== value) {
                this._DELETE_CHILD = value;
            }
        },
        get: function () {
            return this._DELETE_CHILD;
        }
    },
    _EXECUTE: {
        value: null
    },
    EXECUTE: {
        set: function (value) {
            if (this._EXECUTE !== value) {
                this._EXECUTE = value;
            }
        },
        get: function () {
            return this._EXECUTE;
        }
    },
    _LIST_DIRECTORY: {
        value: null
    },
    LIST_DIRECTORY: {
        set: function (value) {
            if (this._LIST_DIRECTORY !== value) {
                this._LIST_DIRECTORY = value;
            }
        },
        get: function () {
            return this._LIST_DIRECTORY;
        }
    },
    _READ_ACL: {
        value: null
    },
    READ_ACL: {
        set: function (value) {
            if (this._READ_ACL !== value) {
                this._READ_ACL = value;
            }
        },
        get: function () {
            return this._READ_ACL;
        }
    },
    _READ_ATTRIBUTES: {
        value: null
    },
    READ_ATTRIBUTES: {
        set: function (value) {
            if (this._READ_ATTRIBUTES !== value) {
                this._READ_ATTRIBUTES = value;
            }
        },
        get: function () {
            return this._READ_ATTRIBUTES;
        }
    },
    _READ_DATA: {
        value: null
    },
    READ_DATA: {
        set: function (value) {
            if (this._READ_DATA !== value) {
                this._READ_DATA = value;
            }
        },
        get: function () {
            return this._READ_DATA;
        }
    },
    _READ_NAMED_ATTRS: {
        value: null
    },
    READ_NAMED_ATTRS: {
        set: function (value) {
            if (this._READ_NAMED_ATTRS !== value) {
                this._READ_NAMED_ATTRS = value;
            }
        },
        get: function () {
            return this._READ_NAMED_ATTRS;
        }
    },
    _SYNCHRONIZE: {
        value: null
    },
    SYNCHRONIZE: {
        set: function (value) {
            if (this._SYNCHRONIZE !== value) {
                this._SYNCHRONIZE = value;
            }
        },
        get: function () {
            return this._SYNCHRONIZE;
        }
    },
    _WRITE_ACL: {
        value: null
    },
    WRITE_ACL: {
        set: function (value) {
            if (this._WRITE_ACL !== value) {
                this._WRITE_ACL = value;
            }
        },
        get: function () {
            return this._WRITE_ACL;
        }
    },
    _WRITE_ATTRIBUTES: {
        value: null
    },
    WRITE_ATTRIBUTES: {
        set: function (value) {
            if (this._WRITE_ATTRIBUTES !== value) {
                this._WRITE_ATTRIBUTES = value;
            }
        },
        get: function () {
            return this._WRITE_ATTRIBUTES;
        }
    },
    _WRITE_DATA: {
        value: null
    },
    WRITE_DATA: {
        set: function (value) {
            if (this._WRITE_DATA !== value) {
                this._WRITE_DATA = value;
            }
        },
        get: function () {
            return this._WRITE_DATA;
        }
    },
    _WRITE_NAMED_ATTRS: {
        value: null
    },
    WRITE_NAMED_ATTRS: {
        set: function (value) {
            if (this._WRITE_NAMED_ATTRS !== value) {
                this._WRITE_NAMED_ATTRS = value;
            }
        },
        get: function () {
            return this._WRITE_NAMED_ATTRS;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "ADD_FILE",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "ADD_SUBDIRECTORY",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "APPEND_DATA",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "DELETE",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "DELETE_CHILD",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "EXECUTE",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "LIST_DIRECTORY",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "READ_ACL",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "READ_ATTRIBUTES",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "READ_DATA",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "READ_NAMED_ATTRS",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "SYNCHRONIZE",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "WRITE_ACL",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "WRITE_ATTRIBUTES",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "WRITE_DATA",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "WRITE_NAMED_ATTRS",
            valueType: "boolean"
        }]
    }
});
