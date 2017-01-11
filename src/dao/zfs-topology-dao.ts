import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
export class ZfsTopologyDao extends AbstractDao {
    public constructor() {
        super(Model.ZfsTopology);
    }
}
