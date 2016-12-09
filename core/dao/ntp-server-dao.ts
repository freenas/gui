import { AbstractDao } from './abstract-dao-ng';

export class NtpServerDao extends AbstractDao {
    private static instance: NtpServerDao;

    private constructor() {
        super(AbstractDao.Model.NtpServer, {
            queryMethod: 'ntp_server.query'
        });
    }

    public static getInstance() {
        if (!NtpServerDao.instance) {
            NtpServerDao.instance = new NtpServerDao();
        }
        return NtpServerDao.instance;
    }

    public syncNow(serverAddress: string) {
        return this.middlewareClient.submitTask('ntp_server.sync_now', [serverAddress]);
    }
}


