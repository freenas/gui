var Montage = require("montage").Montage;

exports.DockerHubImage = Montage.specialize({
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
    _icon: {
        value: null
    },
    icon: {
        set: function (value) {
            if (this._icon !== value) {
                this._icon = value;
            }
        },
        get: function () {
            return this._icon;
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
    _presets: {
        value: null
    },
    presets: {
        set: function (value) {
            if (this._presets !== value) {
                this._presets = value;
            }
        },
        get: function () {
            return this._presets;
        }
    },
    _pull_count: {
        value: null
    },
    pull_count: {
        set: function (value) {
            if (this._pull_count !== value) {
                this._pull_count = value;
            }
        },
        get: function () {
            return this._pull_count;
        }
    },
    _star_count: {
        value: null
    },
    star_count: {
        set: function (value) {
            if (this._star_count !== value) {
                this._star_count = value;
            }
        },
        get: function () {
            return this._star_count;
        }
    },
    _version: {
        value: null
    },
    version: {
        set: function (value) {
            if (this._version !== value) {
                this._version = value;
            }
        },
        get: function () {
            return this._version;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "icon",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "presets",
            valueType: "object"
        }, {
            mandatory: false,
            name: "pull_count",
            valueType: "number"
        }, {
            mandatory: false,
            name: "star_count",
            valueType: "number"
        }, {
            mandatory: false,
            name: "version",
            valueType: "number"
        }]
    }
});
