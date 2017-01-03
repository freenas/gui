import { AbstractDao } from './abstract-dao';

export class SupportCategoryDao extends AbstractDao {

    public constructor() {
        super('SupportCategory', {
            queryMethod: 'support.categories_no_auth'
        });
    }

}

