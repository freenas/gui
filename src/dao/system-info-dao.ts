import {AbstractDao} from './abstract-dao';

export class SystemInfoDao extends AbstractDao {
    public constructor() {
        super('');
    }

    public version() {
        return this.middlewareClient.callRpcMethod('system.info.version');
    }
}
