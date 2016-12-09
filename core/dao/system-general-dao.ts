import { AbstractDao } from './abstract-dao-ng';

export class SystemGeneralDao extends AbstractDao {
    private static instance: SystemGeneralDao;

    private constructor() {
        super(AbstractDao.Model.SystemGeneral, {
            queryMethod: 'system.general.get_config'
        });
    }

    public static getInstance() {
        if (!SystemGeneralDao.instance) {
            SystemGeneralDao.instance = new SystemGeneralDao();
        }
        return SystemGeneralDao.instance;
    }

    public listTimezones(): Promise<Array<string>> {
        return this.middlewareClient.callRpcMethod('system.general.timezones');
    }

    public listKeymaps(): Promise<Array<Array<string>>> {
        return this.middlewareClient.callRpcMethod('system.general.keymaps');
    }
}
