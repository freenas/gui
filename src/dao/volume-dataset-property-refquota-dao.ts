import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {VolumeDatasetPropertyRefquota} from '../model/VolumeDatasetPropertyRefquota';

export class VolumeDatasetPropertyRefquotaDao extends AbstractDao<VolumeDatasetPropertyRefquota> {
    public constructor() {
        super(Model.VolumeDatasetPropertyRefquota);
    }
}
