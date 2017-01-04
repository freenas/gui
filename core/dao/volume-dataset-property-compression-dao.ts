import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VolumeDatasetPropertyCompressionDao extends AbstractDao {
    public constructor() {
        super(Model.VolumeDatasetPropertyCompression);
    }
}
