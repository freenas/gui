import { AbstractDao } from './abstract-dao-ng';

export class KerberosRealmDao extends AbstractDao {
    private static instance: KerberosRealmDao;

    private constructor() {
        super(AbstractDao.Model.KerberosRealm);
    }

    public static getInstance() {
        if (!KerberosRealmDao.instance) {
            KerberosRealmDao.instance = new KerberosRealmDao();
        }
        return KerberosRealmDao.instance;
    }
}

