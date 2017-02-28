import {AbstractDao} from './abstract-dao';
import {LdapDirectoryParams} from '../model/LdapDirectoryParams';
export class LdapDirectoryParamsDao extends AbstractDao<LdapDirectoryParams> {
    public constructor() {
        super(LdapDirectoryParams.getClassName());
    }
}
