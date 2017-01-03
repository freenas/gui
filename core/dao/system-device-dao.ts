import { AbstractDao } from './abstract-dao';

export class SystemDeviceDao extends AbstractDao {

    public constructor() {
        super({});
    }

    public getDevices(deviceClass: string): Promise<Object> {
        return this.middlewareClient.callRpcMethod('system.device.get_devices', [deviceClass])
    }
}
