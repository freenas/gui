import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class ReplicationOptionsDao extends AbstractDao {

    public constructor() {
        super(Model.ReplicationOptions);
    }

}


