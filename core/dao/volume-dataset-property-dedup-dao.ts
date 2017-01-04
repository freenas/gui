import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VolumeDatasetPropertyDedupDao extends AbstractDao {
    public constructor() {
        super(Model.VolumeDatasetPropertyDedup);
    }
}
