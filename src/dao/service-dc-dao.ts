import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {ServiceDc} from '../model/ServiceDc';

export class ServiceDcDao extends AbstractDao<ServiceDc> {
    public constructor() {
        super(Model.ServiceDc, {queryMethod: 'service.dc.get_config'});
    }

    public provideDcIp() {
        return this.middlewareClient.callRpcMethod('service.dc.provide_dc_ip');
    }

    public provideDcUrl() {
        return this.middlewareClient.callRpcMethod('service.dc.provide_dc_url');
    }
}
