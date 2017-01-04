import { AbstractDao } from './abstract-dao';
import * as Promise from "bluebird";
import {Model} from "../model";

export class ServiceDyndnsDao extends AbstractDao {
    public constructor() {
        super(Model.ServiceDyndns, {queryMethod: 'service.dyndns.get_config'});
    }

    public getProviders() {
        return this.middlewareClient.callRpcMethod('service.dyndns.providers');
    }
}
