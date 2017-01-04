import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class ServiceDcDao extends AbstractDao {
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
