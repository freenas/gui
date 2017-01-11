import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VolumeDatasetPropertyAtimeDao extends AbstractDao {
    public constructor() {
        super(Model.VolumeDatasetPropertyAtime);
    }
}
