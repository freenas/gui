import {AbstractDao} from "./abstract-dao";
import {Model} from '../model';

export class CompressReplicationTransportOptionDao extends AbstractDao {
    public constructor() {
        super(Model.CompressReplicationTransportOption);
    }

    public getNewInstance() {
        return super.getNewInstance().then(newInstance => {
            newInstance['%type'] = 'compress-replication-transport-option';
            return newInstance;
        });
    }
}
