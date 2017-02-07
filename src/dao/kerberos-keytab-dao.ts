import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {KerberosKeytab} from '../model/KerberosKeytab';

export class KerberosKeytabDao extends AbstractDao<KerberosKeytab> {

    public constructor() {
        super(Model.KerberosKeytab);
    }

}

