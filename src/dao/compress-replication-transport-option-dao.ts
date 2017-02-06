import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {CompressReplicationTransportOption} from '../model/CompressReplicationTransportOption';

export class CompressReplicationTransportOptionDao extends AbstractDao<CompressReplicationTransportOption> {
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
