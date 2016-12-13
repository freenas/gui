import { AbstractDao } from './abstract-dao-ng';

export class NtpServerDao extends AbstractDao {

    public constructor() {
        super('NtpServer', {
            queryMethod: 'ntp_server.query'
        });
    }

    public syncNow(serverAddress: string) {
        return this.middlewareClient.submitTask('ntp_server.sync_now', [serverAddress]);
    }
}


