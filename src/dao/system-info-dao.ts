import {AbstractDao} from './abstract-dao';

export class SystemInfoDao extends AbstractDao<any> {
    public constructor() {
        super('SystemInfo');
    }

    public version() {
        return this.middlewareClient.callRpcMethod('system.info.version');
    }
}
