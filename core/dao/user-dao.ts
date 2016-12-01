import { AbstractDao } from './abstract-dao-ng';

export class UserDao extends AbstractDao {
    private static instance: UserDao;

    private constructor() {
        super(AbstractDao.Model.User);
    }

    public static getInstance() {
        if (!UserDao.instance) {
            UserDao.instance = new UserDao();
        }
        return UserDao.instance;
    }
}


