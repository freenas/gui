import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VolumeDatasetPropertiesDao extends AbstractDao {
    public constructor() {
        super(Model.VolumeDatasetProperties);
    }
}
