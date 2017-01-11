import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VolumeDatasetPropertyReservationDao extends AbstractDao {
    public constructor() {
        super(Model.VolumeDatasetPropertyReservation);
    }
}
