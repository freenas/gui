import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VolumeDatasetPropertyQuotaDao extends AbstractDao {
    public constructor() {
        super(Model.VolumeDatasetPropertyQuota);
    }
}
