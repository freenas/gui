var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmStatusLease = AbstractModel.specialize({
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
            name: "client_ip"
        }]
    }
});
