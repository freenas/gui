import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class KerberosRealmDao extends AbstractDao {

    public constructor() {
        super(Model.KerberosRealm);
    }

}

