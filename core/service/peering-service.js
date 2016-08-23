var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var PeeringService = exports.PeeringService = Montage.specialize({

    _DEFAULT_TYPE: {
        value: "ssh"
    },

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _peers: {
        value: null
    },

    _peersPromise: {
        value: null
    },

    constructor: {
        value: function() {
            this._dataService = FreeNASService.instance;
        }
    },

    list: {
        value: function() {
            if (this._peers) {
                return Promise.resolve(this._peers);
            } else if (this._peersPromise) {
                return this._peersPromise;
            } else {
                var self = this;
                return this._peersPromise = this._dataService.fetchData(Model.Peer).then(function(peers) {
                    return self._peers = peers;
                });
            }
        }
    },

    populateDefaultType: {
        value: function(object) {
            var self = this;
            return this._getNewCredentialsForType(this._DEFAULT_TYPE).then(function(credentials) {
                object.credentials = credentials;
                object.type = self._DEFAULT_TYPE;
            });
        }
    },

    _getNewCredentialsForType: {
        value: function(type) {
            var credentialModel;
            if (type === "ssh") {
                credentialModel = Model.SshCredentials;
            }
            return this._dataService.getNewInstanceForType(credentialModel).then(function(credentials) {
                credentials.type = type;
                return credentials;
            });
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new PeeringService();
            }
            return this._instance;
        }
    }
});
