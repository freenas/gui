import {AbstractDataObject} from './AbstractDataObject';
import {ZfsVdevType} from './enumerations/ZfsVdevType';

export class ZfsVdev extends AbstractDataObject {
    public guid: string;
    public type: ZfsVdevType;
    public path: string;
    public children: Array<ZfsVdev>;
}
