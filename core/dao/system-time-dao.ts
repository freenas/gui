import { AbstractDao } from './abstract-dao-ng';

export class SystemTimeDao extends AbstractDao {
    private static instance: SystemTimeDao;

    private constructor() {
        super(AbstractDao.Model.SystemTime, {
            queryMethod: 'system.time.get_config'
        });
    }

    public static getInstance() {
        if (!SystemTimeDao.instance) {
            SystemTimeDao.instance = new SystemTimeDao();
        }
        return SystemTimeDao.instance;
    }
}

