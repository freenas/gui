import { AbstractDao } from './abstract-dao-ng';

export class AccountCategoryDao extends AbstractDao {
    private static instance: AccountCategoryDao;

    private constructor() {
        super(AbstractDao.Model.AccountCategory);
    }

    public static getInstance() {
        if (!AccountCategoryDao.instance) {
            AccountCategoryDao.instance = new AccountCategoryDao();
        }
        return AccountCategoryDao.instance;
    }
}


