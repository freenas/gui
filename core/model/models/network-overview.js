var Montage = require("montage").Montage;

exports.NetworkOverview = Montage.specialize({
    _summary: {
        value: null
    },
    summary: {
        set: function (value) {
            if (this._summary !== value) {
                this._summary = value;
            }
        },
        get: function () {
            return this._summary;
        }
    },
    _staticRoutes: {
        value: null
    },
    staticRoutes: {
        set: function (value) {
            if (this._staticRoutes !== value) {
                this._staticRoutes = value;
            }
        },
        get: function () {
            return this._staticRoutes;
        }
    },
    _ipmi: {
        value: null
    },
    ipmi: {
        set: function (value) {
            if (this._ipmi !== value) {
                this._ipmi = value;
            }
        },
        get: function () {
            return this._ipmi;
        }
    },
    _networkConfiguration: {
        value: null
    },
    networkConfiguration: {
        set: function (value) {
            if (this._networkConfiguration !== value) {
                this._networkConfiguration = value;
            }
        },
        get: function () {
            return this._networkConfiguration;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "summary"
        }, {
            mandatory: false,
            name: "staticRoutes"
        }, {
            mandatory: false,
            name: "ipmi"
        }, {
            mandatory: false,
            name: "networkConfiguration"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/network/configuration.reel'
            },
            nameExpression: "'Overview'"
        }
    }
});
