var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model,
    PeerRepository = require('core/repository/peer-repository').PeerRepository;

var PeeringService = exports.PeeringService = Montage.specialize({

    _DEFAULT_TYPE: {
        value: "freenas"
    },

    _CREDENTIALS_PER_TYPE: {
        value: {
            "freenas": {
                model: Model.FreenasCredentials,
                type: "freenas-credentials"
            },
            "ssh": {
                model: Model.SshCredentials,
                type: "ssh-credentials"
            },
            "vmware": {
                model: Model.VmwareCredentials,
                type: "vmware-credentials"
            },
            "amazon-s3": {
                model: Model.AmazonS3Credentials,
                type: "amazon-s3-credentials"
            }
        }
    },

    TYPE_TO_LABEL: {
        value: {}
    },

    constructor: {
        value: function () {
            this._peerRepository = PeerRepository.getInstance();
            this.TYPE_TO_LABEL[ "freenas" ] = "Create Freenas Peering";
            this.TYPE_TO_LABEL[ "amazon-s3" ] = "Create amazon-s3 Peering";
            this.TYPE_TO_LABEL[ "ssh" ] = "Create ssh Peering";
            this.TYPE_TO_LABEL[ "vmware" ] = "Create vmware Peering";
            this._dataService = FreeNASService.instance;
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

    createSshPeer: {
        value: function () {
            return this._createNewPeer("ssh").then(function (peer) {
                peer.credentials.port = 22;
                return peer;
            });
        }
    },

    createFreenasPeer: {
        value: function () {
            return this._createNewPeer("freenas").then(function (peer) {
                peer.credentials.port = 22;
                return peer;
            });
        }
    },

    createAmazonS3Peer: {
        value: function () {
            return this._createNewPeer("amazon-s3");
        }
    },

    createVmwarePeer: {
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
            return this._peerRepository.listPeers();
        }
    },


    listPeers: {
        value: function() {
            return this.list();
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
                return self._getNewCredentialsForType(peerType).then(function (credentials) {
                    peering.credentials = credentials;
                    return peering;
                });
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
