import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class PeerDao extends AbstractDao {
    public constructor() {
        super(Model.Peer);
    }
}
