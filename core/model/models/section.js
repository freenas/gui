var Montage = require("montage").Montage;

exports.Section = Montage.specialize({
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
    _label: {
        value: null
    },
    label: {
        set: function (value) {
            if (this._label !== value) {
                this._label = value;
            }
        },
        get: function () {
            return this._label;
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
    _order: {
        value: null
    },
    order: {
        set: function (value) {
            if (this._order !== value) {
                this._order = value;
            }
        },
        get: function () {
            return this._order;
        }
    },
    _entries: {
        value: null
    },
    entries: {
        set: function (value) {
            if (this._entries !== value) {
                this._entries = value;
            }
        },
        get: function () {
            return this._entries;
        }
    },
    _overview: {
        value: null
    },
    overview: {
        set: function (value) {
            if (this._overview !== value) {
                this._overview = value;
            }
        },
        get: function () {
            return this._overview;
        }
    },
    _settings: {
        value: null
    },
    settings: {
        set: function (value) {
            if (this._settings !== value) {
                this._settings = value;
            }
        },
        get: function () {
            return this._settings;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "id"
        }, {
            mandatory: false,
            name: "label"
        }, {
            mandatory: false,
            name: "icon"
        }, {
            mandatory: false,
            name: "order"
        }, {
            mandatory: false,
            name: "entries"
        }, {
            mandatory: false,
            name: "overview"
        }, {
            mandatory: false,
            name: "settings"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/controls/section-root.reel'
            },
            nameExpression: "label",
            sortExpression: "order"
        }
    }
});
