import {AbstractDataObject} from './AbstractDataObject';
import {ZfsTopology} from './ZfsTopology';
import {VolumeProvidersPresence} from './enumerations/VolumeProvidersPresence';

export class Volume extends AbstractDataObject {
    public topology: ZfsTopology;
    public providers_presence: VolumeProvidersPresence;
}
