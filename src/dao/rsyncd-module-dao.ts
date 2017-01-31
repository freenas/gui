import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {RsyncdModule} from '../model/RsyncdModule';

export class RsyncdModuleDao extends AbstractDao<RsyncdModule> {
    public constructor() {
        super(Model.RsyncdModule);
    }
}
