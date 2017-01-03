import {AbstractSectionService} from "./abstract-section-service-ng";
import {PeerRepository} from "../../repository/peer-repository";
import {ModelEventName} from "../../model-event-name";
import {Map} from "immutable";

export class PeeringSectionService extends AbstractSectionService {
    private peerRepository: PeerRepository;

    public readonly PEER_TYPES = PeerRepository.PEER_TYPES;

    protected init() {
        this.peerRepository = PeerRepository.getInstance();

        this.eventDispatcherService.addEventListener(ModelEventName.Peer.listChange, this.handlePeersChange.bind(this));
    }

    public getNewPeerWithType(peerType: any) {
        return this.peerRepository.getNewPeerWithType(peerType);
    }

    protected loadEntries() {
        this.entries = [];
        return this.peerRepository.listPeers();
    }

    protected loadExtraEntries() {
        return undefined;
    }

    protected loadSettings() {
        return undefined;
    }

    protected loadOverview() {
        return undefined;
    }

    private handlePeersChange(state: Map<string, Map<string, any>>) {
        let self = this;
        state.forEach(function(stateEntry) {
            // DTM
            let entry = self.findObjectWithId(self.entries, stateEntry.get('id'));
            if (entry) {
                Object.assign(entry, stateEntry.toJS());
            } else {
                entry = stateEntry.toJS();
                entry._objectType = 'Peer';
                self.entries.push(entry);
            }
        });
        // DTM
        if (this.entries) {
            for (let i = this.entries.length - 1; i >= 0; i--) {
                if (!state.has(this.entries[i].id)) {
                    this.entries.splice(i, 1);
                }
            }
        }
    }
}
