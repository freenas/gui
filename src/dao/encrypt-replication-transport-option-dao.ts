import {AbstractDao} from "./abstract-dao";
import {Model} from '../model';

export class EncryptReplicationTransportOptionDao extends AbstractDao {
    public constructor() {
        super(Model.EncryptReplicationTransportOption);
    }

    public getNewInstance() {
        return super.getNewInstance().then(newInstance => {
            newInstance['%type'] = 'encrypt-replication-transport-option';
            return newInstance;
        });
    }
}
