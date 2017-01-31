import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {VolumeDatasetProperties} from '../model/VolumeDatasetProperties';

export class VolumeDatasetPropertiesDao extends AbstractDao<VolumeDatasetProperties> {
    public constructor() {
        super(Model.VolumeDatasetProperties);
    }
}
