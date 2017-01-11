import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class KerberosKeytabDao extends AbstractDao {

    public constructor() {
        super(Model.KerberosKeytab);
    }

}

