import { AbstractDao } from './abstract-dao';
import {Model} from '../model';

export class NtpServerDao extends AbstractDao {

    public constructor() {
        super(Model.NtpServer, {
            queryMethod: 'ntp_server.query',
            updateMethod: 'ntp_server.update',
            createMethod: 'ntp_server.create',
            deleteMethod: 'ntp_server.delete'
        });
    }

    public syncNow(serverAddress: string) {
        return this.middlewareClient.submitTask('ntp_server.sync_now', [serverAddress]);
    }
}


