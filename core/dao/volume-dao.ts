import { AbstractDao } from './abstract-dao-ng';

export class VolumeDao extends AbstractDao {
    private static instance: VolumeDao;

    private constructor() {
        super(AbstractDao.Model.Volume);
    }

    public static getInstance() {
        if (!VolumeDao.instance) {
            VolumeDao.instance = new VolumeDao();
        }
        return VolumeDao.instance;
    }

    public getDisksAllocation(diskIds: Array<string>): Promise<Array<Object>> {
        return this.middlewareClient.callRpcMethod('volume.get_disks_allocation', [diskIds]);
    }

    public getAvailableDisks(): Promise<Array<string>> {
        return this.middlewareClient.callRpcMethod('volume.get_available_disks');
    }

}



