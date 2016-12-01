import { AbstractDao } from './abstract-dao-ng';

export class EncryptedVolumeActionsDao extends AbstractDao {
    private static instance: EncryptedVolumeActionsDao;

    private constructor() {
        super(AbstractDao.Model.EncryptedVolumeActions);
    }

    public static getInstance() {
        if (!EncryptedVolumeActionsDao.instance) {
            EncryptedVolumeActionsDao.instance = new EncryptedVolumeActionsDao();
        }
        return EncryptedVolumeActionsDao.instance;
    }
}

