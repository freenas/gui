import { AbstractDao } from './abstract-dao-ng';

export class UpdateDao extends AbstractDao {

    public constructor() {
        super('Update', {
            queryMethod: 'update.get_config'
        });
    }

}

