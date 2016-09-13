var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.DockerHubImage = AbstractModel.specialize({
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
    _full_description: {
        value: null
    },
    full_description: {
        set: function (value) {
            if (this._full_description !== value) {
                this._full_description = value;
            }
        },
        get: function () {
            return this._full_description;
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
    _namespace: {
        value: null
    },
    namespace: {
        set: function (value) {
            if (this._namespace !== value) {
                this._namespace = value;
            }
        },
        get: function () {
            return this._namespace;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "full_description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "namespace",
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
            name: "updated_at",
            valueType: "datetime"
        }]
    }
});
