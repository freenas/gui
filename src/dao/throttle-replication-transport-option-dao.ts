import {AbstractDao} from "./abstract-dao";
import {Model} from '../model';

export class ThrottleReplicationTransportOptionDao extends AbstractDao {
    public constructor() {
        super(Model.ThrottleReplicationTransportOption);
    }

    public getNewInstance() {
        return super.getNewInstance().then(newInstance => {
            newInstance['%type'] = 'throttle-replication-transport-option';
            return newInstance;
        });
    }
}
