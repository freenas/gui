import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import {VmVolume} from '../model/VmVolume';

export class VmVolumeDao extends AbstractDao<VmVolume> {
    public constructor() {
        super(Model.VmVolume);
    }

    public getNewInstance(): Promise<any> {
        return super.getNewInstance().then((newInstance) => _.assign(newInstance, {id: uuid.v4()}));
    }
}
