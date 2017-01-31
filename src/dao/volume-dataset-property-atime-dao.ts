import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {VolumeDatasetPropertyAtime} from '../model/VolumeDatasetPropertyAtime';

export class VolumeDatasetPropertyAtimeDao extends AbstractDao<VolumeDatasetPropertyAtime> {
    public constructor() {
        super(Model.VolumeDatasetPropertyAtime);
    }
}
