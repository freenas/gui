import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import * as _ from 'lodash';
import {VmGuestInfo} from '../model/VmGuestInfo';

export class VmGuestInfoDao extends AbstractDao<VmGuestInfo> {
    public constructor() {
        super(Model.VmGuestInfo);
    }

    public getGuestInfo(vm: any): Promise<any> {
        return this.middlewareClient.callRpcMethod('vm.get_guest_info', [vm.id]).then((guestInfo) => _.assign(guestInfo, {_objectType: Model.VmGuestInfo})).catch((e) => {return null});
    }
}
