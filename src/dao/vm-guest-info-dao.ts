import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import * as _ from 'lodash';

export class VmGuestInfoDao extends AbstractDao {
    public constructor() {
        super(Model.VmGuestInfo);
    }

    public getGuestInfo(vm: any): Promise<any> {
        return this.middlewareClient.callRpcMethod('vm.get_guest_info', [vm.id]).then((guestInfo) => _.assign(guestInfo, {_objectType: Model.VmGuestInfo}));
    }
}
