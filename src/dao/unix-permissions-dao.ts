import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {UnixPermissions} from '../model/UnixPermissions';

export class UnixPermissionsDao extends AbstractDao<UnixPermissions> {
    public constructor() {
        super(Model.UnixPermissions);
    }

    public getNewInstance(): Promise<any> {
        return AbstractDao.prototype.getNewInstance.call(this).then((permissions) => {
            permissions.user = {};
            permissions.group = {};
            permissions.others = {};
            return permissions;
        });
    }
}
