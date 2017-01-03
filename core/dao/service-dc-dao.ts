import { AbstractDao } from './abstract-dao';

export class ServiceDcDao extends AbstractDao {
    public constructor() {
        super('ServiceDc', {queryMethod: 'service.dc.get_config'});
    }

    public provideDcIp() {
        return this.middlewareClient.callRpcMethod('service.dc.provide_dc_ip');
    }

    public provideDcUrl() {
        return this.middlewareClient.callRpcMethod('service.dc.provide_dc_url');
    }
}
