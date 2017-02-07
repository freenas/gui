import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {ZfsTopology} from '../model/ZfsTopology';

export class ZfsTopologyDao extends AbstractDao<ZfsTopology> {
    public constructor() {
        super(Model.ZfsTopology);
    }
}
