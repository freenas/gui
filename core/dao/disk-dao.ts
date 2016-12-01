import { AbstractDao } from './abstract-dao-ng';

export class DiskDao extends AbstractDao {
    private static instance: DiskDao;

    private constructor() {
        super(AbstractDao.Model.Disk);
    }

    public static getInstance() {
        if (!DiskDao.instance) {
            DiskDao.instance = new DiskDao();
        }
        return DiskDao.instance;
    }
}


