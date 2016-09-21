var Montage = require("montage").Montage;

exports.VmStatusLease = Montage.specialize({
    _client_ip: {
        value: null
    },
    client_ip: {
        set: function (value) {
            if (this._client_ip !== value) {
                this._client_ip = value;
            }
        },
        get: function () {
            return this._client_ip;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "client_ip",
            valueType: "String"
        }]
    }
});
