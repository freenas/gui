import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {ServiceUps} from '../model/ServiceUps';

export class ServiceUpsDao extends AbstractDao<ServiceUps> {
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
