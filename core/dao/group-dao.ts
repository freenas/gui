import { AbstractDao } from './abstract-dao-ng';

export class GroupDao extends AbstractDao {
    private static instance: GroupDao;

    private constructor() {
        super(AbstractDao.Model.Group);
    }

    public static getInstance() {
        if (!GroupDao.instance) {
            GroupDao.instance = new GroupDao();
        }
        return GroupDao.instance;
    }
}

