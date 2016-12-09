import { AbstractDao } from './abstract-dao-ng';

export class DirectoryDao extends AbstractDao {
    private static instance: DirectoryDao;

    private constructor() {
        super(AbstractDao.Model.Directory);
    }

    public static getInstance() {
        if (!DirectoryDao.instance) {
            DirectoryDao.instance = new DirectoryDao();
        }
        return DirectoryDao.instance;
    }
}
