var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var PeeringService = exports.PeeringService = Montage.specialize({

    _DEFAULT_TYPE: {
        value: "freenas"
    },

    _CREDENTIALS_PER_TYPE: {
        value: {
            "freenas": {
                model: Model.FreenasCredentials,
                type: "freenas-credentials"
            }
        }
    },

    TYPE_TO_LABEL: {
        value: {}
    },

    constructor: {
        value: function () {
            this.TYPE_TO_LABEL[ "freenas" ] = "Create Freenas Peering";
            this.TYPE_TO_LABEL[ "amazon-s3" ] = "Create amazon-s3 Peering";
            this.TYPE_TO_LABEL[ "ssh" ] = "Create ssh Peering";
            this.TYPE_TO_LABEL[ "vmware" ] = "Create vmware Peering";
        }
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

    populateObjectPeeringSsh: {
        value: function () {
            return this._createNewPeer("ssh");
        }
    },

    populateObjectPeeringFreenas: {
        value: function () {
            return this._createNewPeer("freenas");
        }
    },

    populateObjectPeeringAmazonS3: {
        value: function () {
            return this._createNewPeer("amazon-s3");
        }
    },

    populateObjectPeeringVmware: {
        value: function () {
            return this._createNewPeer("vmware");
        }
    },

    getSupportedTypes: {
        value: function() {
            return Model.populateObjectPrototypeForType(Model.Peer).then(function (Peer) {
                return Peer.constructor.services.peerTypes();
            })
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


    listPeers: {
        value: function() {
            return this._dataService.fetchData(Model.Peer).then(function (peers) {
                return peers;
            });
        }
    },

    populateDefaultType: {
        value: function(object) {
            var self = this;
            return this._getNewCredentialsForType(this._DEFAULT_TYPE).then(function(credentials) {
                object.credentials = credentials;
                object['%type'] = self._DEFAULT_TYPE;
                return object;
            });
        }
    },

    _createNewPeer: {
        value: function (peerType) {
            var self = this;
            return this._dataService.getNewInstanceForType(Model.Peer).then(function (peering) {
                peering._isNewObject = true;
                peering.type = peerType;
                peering._action = peerType;
                peering._label = self.TYPE_TO_LABEL[peerType];
                return peering;
            })
        }
    },

    _getNewCredentialsForType: {
        value: function(type) {
            var credentialsType = this._CREDENTIALS_PER_TYPE[type];
            return this._dataService.getNewInstanceForType(credentialsType.model).then(function(credentials) {
                credentials['%type'] = credentialsType.type;
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
