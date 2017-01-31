import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {ServiceDyndns} from '../model/ServiceDyndns';

export class ServiceDyndnsDao extends AbstractDao<ServiceDyndns> {
    public constructor() {
        super(Model.ServiceDyndns, {queryMethod: 'service.dyndns.get_config'});
    }

    public getProviders() {
        return this.middlewareClient.callRpcMethod('service.dyndns.providers');
    }
}
