import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {Permissions} from '../model/Permissions';

export class PermissionsDao extends AbstractDao<Permissions> {
    public constructor() {
        super(Model.Permissions);
    }
}
