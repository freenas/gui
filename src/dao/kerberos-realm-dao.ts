import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {KerberosRealm} from '../model/KerberosRealm';

export class KerberosRealmDao extends AbstractDao<KerberosRealm> {

    public constructor() {
        super(Model.KerberosRealm);
    }

}

