import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import * as _ from 'lodash';
import * as uuid from 'uuid';

export class VmDeviceDao extends AbstractDao {
    public constructor() {
        super(Model.VmDevice);
    }

    public getNewInstance(): Promise<any> {
        return super.getNewInstance().then((newInstance) => _.assign(newInstance, {id: uuid.v4()}));
    }
}
