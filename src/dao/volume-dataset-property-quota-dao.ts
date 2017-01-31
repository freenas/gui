import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {VolumeDatasetPropertyQuota} from '../model/VolumeDatasetPropertyQuota';

export class VolumeDatasetPropertyQuotaDao extends AbstractDao<VolumeDatasetPropertyQuota> {
    public constructor() {
        super(Model.VolumeDatasetPropertyQuota);
    }
}
