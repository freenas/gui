import {VolumePropertySource} from './enumerations/VolumePropertySource';
import {VolumeDatasetPropertyvolblocksizeValue} from './enumerations/VolumeDatasetPropertyvolblocksizeValue';
import {VolumeDatasetPropertydedupValue} from './enumerations/VolumeDatasetPropertydedupValue';
import {VolumeDatasetPropertycompressionValue} from './enumerations/VolumeDatasetPropertycompressionValue';
import {VolumeDatasetPropertycasesensitivityValue} from './enumerations/VolumeDatasetPropertycasesensitivityValue';

export abstract class VolumeDatasetProperty {
    public source: VolumePropertySource;
    public rawvalue: string;
    public value: string;
    public parsed:  VolumeDatasetPropertycasesensitivityValue | VolumeDatasetPropertycompressionValue | VolumeDatasetPropertydedupValue | VolumeDatasetPropertyvolblocksizeValue | number | null;

}
