import { AbstractDao } from './abstract-dao-ng';

export class UpdateDao extends AbstractDao {
    private static instance: UpdateDao;

    private constructor() {
        super(AbstractDao.Model.Update, {
            queryMethod: 'update.get_config'
        });
    }

    public static getInstance() {
        if (!UpdateDao.instance) {
            UpdateDao.instance = new UpdateDao();
        }
        return UpdateDao.instance;
    }
}

