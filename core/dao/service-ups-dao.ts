import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class ServiceUpsDao extends AbstractDao {
    public constructor() {
        super(Model.ServiceUps, {queryMethod: 'service.ups.get_config'});
    }

    public getDrivers() {
        return this.middlewareClient.callRpcMethod('service.ups.drivers');
    }

    public getUsbDevices() {
        return this.middlewareClient.callRpcMethod('service.ups.get_usb_devices');
    }
}
