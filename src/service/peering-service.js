var Montage = require("montage").Montage,
    ModelDescriptorService = require('core/service/model-descriptor-service').ModelDescriptorService,
    PeerRepository = require('core/repository/peer-repository').PeerRepository,
    Model = require("core/model").Model;

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
            this.modelDescriptorService = ModelDescriptorService.getInstance();
            this.peerRepository = PeerRepository.getInstance();
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

    list: {
        value: function() {
            if (this._peers) {
                return Promise.resolve(this._peers);
            } else if (this._peersPromise) {
                return this._peersPromise;
            } else {
                var self = this;
                return this._peersPromise = this.peerRepository.listPeers().then(function(peers) {
                    return self._peers = peers;
                });
            }
        }
    },


    listPeers: {
        value: function() {
            return this.peerRepository.listPeers().then(function (peers) {
                return peers;
            });
        }
    },

    _createNewPeer: {
        value: function (peerType) {
            return this.peerRepository.getNewPeerWithType(peerType);
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
