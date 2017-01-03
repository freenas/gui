import { AbstractDao } from './abstract-dao';

export class SystemTimeDao extends AbstractDao {


    public constructor() {
        super('SystemTime', {
            queryMethod: 'system.time.get_config',
            preventQueryCaching: true
        });
    }

}

