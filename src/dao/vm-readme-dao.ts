import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VmReadmeDao extends AbstractDao {
    public constructor() {
        super(Model.VmReadme);
    }
}
