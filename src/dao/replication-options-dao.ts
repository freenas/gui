import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {ReplicationOptions} from '../model/ReplicationOptions';

export class ReplicationOptionsDao extends AbstractDao<ReplicationOptions> {

    public constructor() {
        super(Model.ReplicationOptions);
    }

}


