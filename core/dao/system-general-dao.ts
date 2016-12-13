import { AbstractDao } from './abstract-dao-ng';

export class SystemGeneralDao extends AbstractDao {

    public constructor() {
        super('SystemGeneral', {
            queryMethod: 'system.general.get_config',
            createMethod: 'system.general.update'
        });
    }

    public listTimezones(): Promise<Array<string>> {
        return this.middlewareClient.callRpcMethod('system.general.timezones');
    }

    public listKeymaps(): Promise<Array<Array<string>>> {
        return this.middlewareClient.callRpcMethod('system.general.keymaps');
    }
}
