import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {Peer} from '../model/Peer';

export class PeerDao extends AbstractDao<Peer> {
    public constructor() {
        super(Model.Peer);
    }
}
