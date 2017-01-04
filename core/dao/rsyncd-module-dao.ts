import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class RsyncdModuleDao extends AbstractDao {
    public constructor() {
        super(Model.RsyncdModule);
    }
}
