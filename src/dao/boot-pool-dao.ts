import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {BootPool} from '../model/BootPool';

export class BootPoolDao extends AbstractDao<BootPool> {

    public constructor() {
        super(Model.BootPool, {
            queryMethod: 'boot.pool.get_config',
            eventName: 'entity-subscriber.boot.pool.changed'
        });
    }

    public getConfig() {
        return this.middlewareClient.callRpcMethod('boot.pool.get_config');
    }

    public scrub() {
        return this.middlewareClient.submitTask('boot.pool.scrub');
    }
}

