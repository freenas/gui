import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class PermissionsDao extends AbstractDao {
    public constructor() {
        super(Model.Permissions);
    }
}
