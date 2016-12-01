import { AbstractDao } from './abstract-dao-ng';

export class SectionDao extends AbstractDao {
    private static instance: SectionDao;

    private constructor() {
        super(AbstractDao.Model.Section);
    }

    public static getInstance() {
        if (!SectionDao.instance) {
            SectionDao.instance = new SectionDao();
        }
        return SectionDao.instance;
    }
}
