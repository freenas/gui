import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {VolumeDatasetPropertyCompression} from '../model/VolumeDatasetPropertyCompression';

export class VolumeDatasetPropertyCompressionDao extends AbstractDao<VolumeDatasetPropertyCompression> {
    public constructor() {
        super(Model.VolumeDatasetPropertyCompression);
    }
}
