import { AbstractDao } from './abstract-dao';

export class SystemDeviceDao extends AbstractDao<any> {

    public constructor() {
        super('SystemDevice', {
            eventName: 'entity-subscriber.system.device.changed'
        });
    }

    public getDevices(deviceClass: string): Promise<Object> {
        return this.middlewareClient.callRpcMethod('system.device.get_devices', [deviceClass]);
    }
}
