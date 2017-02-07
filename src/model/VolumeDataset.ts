import {AbstractDataObject} from './AbstractDataObject';
import {VolumeDatasetProperties} from './VolumeDatasetProperties';

export class VolumeDataset extends AbstractDataObject {
    public properties: VolumeDatasetProperties;
    public type: string;
    public volsize: number;
}
