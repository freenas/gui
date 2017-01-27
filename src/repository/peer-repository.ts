import {AbstractRepository} from "./abstract-repository-ng";
import {ModelEventName} from "../model-event-name";
import {PeerDao} from "../dao/peer-dao";
import {Map} from "immutable";
import {Model} from "../model";

export class PeerRepository extends AbstractRepository {
    private static instance: PeerRepository;

    private peers: Map<string, Map<string, any>>;

    public static readonly PEER_TYPES = {
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

    public constructor(private peerDao: PeerDao) {
        super([Model.Peer]);
    }

    public static getInstance() {
        if (!PeerRepository.instance) {
            PeerRepository.instance = new PeerRepository(
                new PeerDao()
            );
        }
        return PeerRepository.instance;
    }

    public listPeers() {
        return this.peers ?
            Promise.resolve(this.peers.toList().toJS()) :
            this.peerDao.list();
    }

    public getNewPeerWithType(peerType) {
        return Promise.all([
            this.peerDao.getNewInstance(),
            this.modelDescriptorService.getDaoForType(peerType.credentials.objectType).then(function(dao) {
                return dao.getNewInstance();
            })
        ]).spread(function (newPeer: any, newCredentials: any) {
            newPeer._isNewObject = true;
            newPeer._tmpId = peerType.type;
            newPeer.type = peerType.type;
            newPeer._action = peerType.type;
            newPeer._label = peerType.label;
            newCredentials['%type'] = peerType.credentials.type;
            newPeer.credentials = newCredentials;
            return newPeer;
        });
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'Peer':
                this.peers = this.dispatchModelEvents(this.peers, ModelEventName.Peer, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }

}
