import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {VolumeDatasetPropertyCasesensitivity} from '../model/VolumeDatasetPropertyCasesensitivity';

export class VolumeDatasetPropertyCasesensitivityDao extends AbstractDao<VolumeDatasetPropertyCasesensitivity> {
    public constructor() {
        super(Model.VolumeDatasetPropertyCasesensitivity);
    }
}
