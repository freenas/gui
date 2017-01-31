import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {VolumeDatasetPropertyRefreservation} from '../model/VolumeDatasetPropertyRefreservation';

export class VolumeDatasetPropertyRefreservationDao extends AbstractDao<VolumeDatasetPropertyRefreservation> {
    public constructor() {
        super(Model.VolumeDatasetPropertyRefreservation);
    }
}
