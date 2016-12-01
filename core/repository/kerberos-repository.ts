import {KerberosKeytabDao} from "../dao/kerberos-keytab-dao";
import {KerberosRealmDao} from "../dao/kerberos-realm-dao";
export class KerberosRepository {
    private static instance: KerberosRepository;

    private constructor(
       private kerberosKeytabDao: KerberosKeytabDao,
       private kerberosRealmDao: KerberosRealmDao
    ) {}

    public static getInstance() {
        if (!KerberosRepository.instance) {
            KerberosRepository.instance = new KerberosRepository(
                KerberosKeytabDao.getInstance(),
                KerberosRealmDao.getInstance()
            );
        }
        return KerberosRepository.instance;
    }

    public getNewKerberosRealm() {
        return this.kerberosRealmDao.getNewInstance();
    }

    public getKerberosRealmEmptyList() {
        return this.kerberosRealmDao.getEmptyList();
    }

    public getKerberosKeytabEmptyList() {
        return this.kerberosKeytabDao.getEmptyList();
    }

    public getNewKerberosKeytab() {
        return this.kerberosKeytabDao.getNewInstance();
    }

    public listKerberosRealms() {
        return this.kerberosRealmDao.list();
    }

    public saveKerberosRealm(kerberosRealm) {
        return this.kerberosRealmDao.save(kerberosRealm);
    }

    public deleteKerberosRealm(kerberosRealm) {
        return this.kerberosRealmDao.delete(kerberosRealm);
    }

    public saveKerberosKeytab(kerberosKeytab) {
        return this.kerberosKeytabDao.save(kerberosKeytab);
    }

    public listNtpServers() {
        return this.ntpServerDao.list();
    }
}


