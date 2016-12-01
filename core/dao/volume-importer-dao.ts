import { AbstractDao } from './abstract-dao-ng';

export class VolumeImporterDao extends AbstractDao {
    private static instance: VolumeImporterDao;

    private constructor() {
        super(AbstractDao.Model.VolumeImporter);
    }

    public static getInstance() {
        if (!VolumeImporterDao.instance) {
            VolumeImporterDao.instance = new VolumeImporterDao();
        }
        return VolumeImporterDao.instance;
    }

}
