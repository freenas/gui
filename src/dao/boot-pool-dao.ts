import { AbstractDao } from './abstract-dao';

export class BootPoolDao extends AbstractDao<any> {

    public constructor() {
        super('BootPoolConfig', {
            typeName: 'BootPoolConfig'
        });
    }

    public getConfig() {
        return this.middlewareClient.callRpcMethod('boot.pool.get_config');
    }

    public scrub() {
        return this.middlewareClient.submitTask('boot.pool.scrub');
    }
}

