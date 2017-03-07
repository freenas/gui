import {AbstractDataObject} from './AbstractDataObject';
import {ZfsVdev} from './ZfsVdev';

export class ZfsTopology extends AbstractDataObject {
    data: Array<ZfsVdev>;
}
