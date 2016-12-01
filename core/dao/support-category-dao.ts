import { AbstractDao } from './abstract-dao-ng';

export class SupportCategoryDao extends AbstractDao {
    private static instance: SupportCategoryDao;

    private constructor() {
        super(AbstractDao.Model.SupportCategory, {
            queryMethod: 'support.categories_no_auth'
        });
    }

    public static getInstance() {
        if (!SupportCategoryDao.instance) {
            SupportCategoryDao.instance = new SupportCategoryDao();
        }
        return SupportCategoryDao.instance;
    }
}

