import { AbstractDao } from './abstract-dao-ng';

export class ShareDao extends AbstractDao {
    private static instance: ShareDao;

    private constructor() {
        super(AbstractDao.Model.Share);
    }

    public static getInstance() {
        if (!ShareDao.instance) {
            ShareDao.instance = new ShareDao();
        }
        return ShareDao.instance;
    }
}



