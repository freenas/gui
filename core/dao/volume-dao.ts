import { AbstractDao } from './abstract-dao-ng';

export class VolumeDao extends AbstractDao {

    public constructor() {
        super('Volume');
    }

    public getDisksAllocation(diskIds: Array<string>): Promise<Array<Object>> {
        return this.middlewareClient.callRpcMethod('volume.get_disks_allocation', [diskIds]);
    }

    public getAvailableDisks(): Promise<Array<string>> {
        return this.middlewareClient.callRpcMethod('volume.get_available_disks');
    }

}



