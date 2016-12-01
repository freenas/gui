import { AbstractDao } from './abstract-dao-ng';

export class SystemDeviceDao extends AbstractDao {
    private static instance: SystemDeviceDao;

    private constructor() {
        super({});
    }

    public static getInstance() {
        if (!SystemDeviceDao.instance) {
            SystemDeviceDao.instance = new SystemDeviceDao();
        }
        return SystemDeviceDao.instance;
    }

    public getDevices(deviceClass: string): Promise<Object> {
        return this.middlewareClient.callRpcMethod('system.device.get_devices', [deviceClass])
    }
}
