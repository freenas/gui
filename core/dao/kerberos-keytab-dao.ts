import { AbstractDao } from './abstract-dao-ng';

export class KerberosKeytabDao extends AbstractDao {
    private static instance: KerberosKeytabDao;

    private constructor() {
        super(AbstractDao.Model.KerberosKeytab);
    }

    public static getInstance() {
        if (!KerberosKeytabDao.instance) {
            KerberosKeytabDao.instance = new KerberosKeytabDao();
        }
        return KerberosKeytabDao.instance;
    }
}

