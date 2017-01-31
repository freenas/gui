import {KerberosKeytabDao} from '../dao/kerberos-keytab-dao';
import {KerberosRealmDao} from '../dao/kerberos-realm-dao';
import {Model} from '../model';
import {AbstractRepository} from './abstract-repository-ng';
import {Map} from 'immutable';
import {ModelEventName} from '../model-event-name';

export class KerberosRepository extends AbstractRepository {
    private static instance: KerberosRepository;
    private keytabs: Map<string, Map<string, any>>;
    private realms: Map<string, Map<string, any>>;

    private constructor(
       private kerberosKeytabDao: KerberosKeytabDao,
       private kerberosRealmDao: KerberosRealmDao
    ) {
        super([
            Model.KerberosKeytab,
            Model.KerberosRealm
        ])
    }

    public static getInstance() {
        if (!KerberosRepository.instance) {
            KerberosRepository.instance = new KerberosRepository(
                new KerberosKeytabDao(),
                new KerberosRealmDao()
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

    public listKerberosKeytabs() {
        return this.kerberosKeytabDao.list();
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

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case Model.KerberosRealm:
                this.realms = this.dispatchModelEvents(this.realms, ModelEventName.KerberosRealm, state);
                break;
            case Model.KerberosKeytab:
                this.keytabs = this.dispatchModelEvents(this.keytabs, ModelEventName.KerberosKeytab, state);
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }
}


