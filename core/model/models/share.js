var Montage = require("montage/core/core").Montage;
var Permissions = require("core/model/models/permissions").Permissions;

exports.Share = Montage.specialize({
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
    _filesystem_path: {
        value: null
    },
    filesystem_path: {
        set: function (value) {
            if (this._filesystem_path !== value) {
                this._filesystem_path = value;
            }
        },
        get: function () {
            return this._filesystem_path;
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
    _immutable: {
        value: null
    },
    immutable: {
        set: function (value) {
            if (this._immutable !== value) {
                this._immutable = value;
            }
        },
        get: function () {
            return this._immutable;
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
    _permissions: {
        value: null
    },
    permissions: {
        set: function (value) {
            if (this._permissions !== value) {
                this._permissions = value;
            }
        },
        get: function () {
            return this._permissions || (this._permissions = new Permissions());
        }
    },
    _properties: {
        value: null
    },
    properties: {
        set: function (value) {
            if (this._properties !== value) {
                this._properties = value;
            }
        },
        get: function () {
            return this._properties;
        }
    },
    _target_path: {
        value: null
    },
    target_path: {
        set: function (value) {
            if (this._target_path !== value) {
                this._target_path = value;
            }
        },
        get: function () {
            return this._target_path;
        }
    },
    _target_type: {
        value: null
    },
    target_type: {
        set: function (value) {
            if (this._target_type !== value) {
                this._target_type = value;
            }
        },
        get: function () {
            return this._target_type;
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
});
