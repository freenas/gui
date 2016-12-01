import { AbstractDao } from './abstract-dao-ng';

export class BootPoolDao extends AbstractDao {
    private static instance: BootPoolDao;

    private constructor() {
        super({}, {
            typeName: 'BootPoolConfig'
        });
    }

    public static getInstance() {
        if (!BootPoolDao.instance) {
            BootPoolDao.instance = new BootPoolDao();
        }
        return BootPoolDao.instance;
    }

    public getConfig() {
        return this.middlewareClient.callRpcMethod('boot.pool.get_config');
    }

    public scrub() {
        return this.middlewareClient.callRpcMethod('boot.pool.scrub');
    }
}

