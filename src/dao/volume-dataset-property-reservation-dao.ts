import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {VolumeDatasetPropertyReservation} from '../model/VolumeDatasetPropertyReservation';

export class VolumeDatasetPropertyReservationDao extends AbstractDao<VolumeDatasetPropertyReservation> {
    public constructor() {
        super(Model.VolumeDatasetPropertyReservation);
    }
}
