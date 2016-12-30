import { AbstractDao } from './abstract-dao-ng';
import * as Promise from "bluebird";

export class ServiceUpsDao extends AbstractDao {
    public constructor() {
        super('ServiceUps', {queryMethod: 'service.ups.get_config'});
    }

    public getDrivers() {
        return this.middlewareClient.callRpcMethod('service.ups.drivers');
    }

    public getUsbDevices() {
        return this.middlewareClient.callRpcMethod('service.ups.get_usb_devices');
    }
}
