import { AbstractDao } from './abstract-dao-ng';

export class SystemDatasetDao extends AbstractDao {
    private static instance: SystemDatasetDao;

    private constructor() {
        super({}, {
            typeName: 'SystemDataset',
            queryMethod: 'system_dataset.status'
        });
    }

    public static getInstance() {
        if (!SystemDatasetDao.instance) {
            SystemDatasetDao.instance = new SystemDatasetDao();
        }
        return SystemDatasetDao.instance;
    }
}

