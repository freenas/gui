"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var model_event_name_1 = require("../model-event-name");
var peer_dao_1 = require("../dao/peer-dao");
var Promise = require("bluebird");
var PeerRepository = (function (_super) {
    __extends(PeerRepository, _super);
    function PeerRepository(peerDao) {
        _super.call(this, [
            'Peer'
        ]);
        this.peerDao = peerDao;
    }
    PeerRepository.getInstance = function () {
        if (!PeerRepository.instance) {
            PeerRepository.instance = new PeerRepository(new peer_dao_1.PeerDao());
        }
        return PeerRepository.instance;
    };
    PeerRepository.prototype.listPeers = function () {
        return this.peers ?
            Promise.resolve(this.peers.toList().toJS()) :
            this.peerDao.list();
    };
    PeerRepository.prototype.getNewPeerWithType = function (peerType) {
        return Promise.all([
            this.peerDao.getNewInstance(),
            this.modelDescriptorService.getDaoForType(peerType.credentials.objectType).then(function (dao) {
                return dao.getNewInstance();
            })
        ]).spread(function (newPeer, newCredentials) {
            newPeer._isNewObject = true;
            newPeer._tmpId = peerType.type;
            newPeer.type = peerType.type;
            newPeer._action = peerType.type;
            newPeer._label = peerType.label;
            newCredentials['%type'] = peerType.credentials.type;
            newPeer.credentials = newCredentials;
            return newPeer;
        });
    };
    PeerRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'Peer':
                this.peers = this.dispatchModelEvents(this.peers, model_event_name_1.ModelEventName.Peer, state);
                break;
            default:
                break;
        }
    };
    PeerRepository.prototype.handleEvent = function (name, data) {
    };
    PeerRepository.PEER_TYPES = {
        FREENAS: {
            type: 'freenas',
            label: 'Freenas',
            credentials: {
                objectType: 'FreenasCredentials',
                type: "freenas-credentials"
            }
        },
        SSH: {
            type: 'ssh',
            label: 'ssh',
            credentials: {
                objectType: 'SshCredentials',
                type: "ssh-credentials"
            }
        },
        VMWARE: {
            type: 'vmware',
            label: 'VMware',
            credentials: {
                objectType: 'VmwareCredentials',
                type: "vmware-credentials"
            }
        },
        AMAZON_S3: {
            type: 'amazon-s3',
            label: 'Amazon S3',
            credentials: {
                objectType: 'AmazonS3Credentials',
                type: "amazon-s3-credentials"
            }
        }
    };
    return PeerRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.PeerRepository = PeerRepository;
