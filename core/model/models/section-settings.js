var Montage = require("montage").Montage;

exports.SectionSettings = Montage.specialize({
    _section: {
        value: null
    },
    section: {
        set: function (value) {
            if (this._section !== value) {
                this._section = value;
            }
        },
        get: function () {
            return this._section;
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
            name: "section"
        }, {
            mandatory: false,
            name: "settings"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/controls/section.reel/section-settings.reel'
            },
            nameExpression: "section.label + ' settings'"
        }
    }
});
