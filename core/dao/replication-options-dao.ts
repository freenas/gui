import { AbstractDao } from './abstract-dao-ng';

export class ReplicationOptionsDao extends AbstractDao {
    private static instance: ReplicationOptionsDao;

    private constructor() {
        super(AbstractDao.Model.ReplicationOptions);
    }

    public static getInstance() {
        if (!ReplicationOptionsDao.instance) {
            ReplicationOptionsDao.instance = new ReplicationOptionsDao();
        }
        return ReplicationOptionsDao.instance;
    }

}


