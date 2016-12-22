import { AbstractDao } from './abstract-dao-ng';

export class SystemTimeDao extends AbstractDao {

    public constructor() {
        super('SystemTime', {
            queryMethod: 'system.time.get_config'
        });
    }

}

