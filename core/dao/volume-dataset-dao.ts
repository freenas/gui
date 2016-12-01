import { AbstractDao } from './abstract-dao-ng';

export class VolumeDatasetDao extends AbstractDao {
    private static instance: VolumeDatasetDao;

    private constructor() {
        super(AbstractDao.Model.VolumeDataset, {
            eventName: 'entity-subscriber.volume.dataset.changed'
        });
    }

    public static getInstance() {
        if (!VolumeDatasetDao.instance) {
            VolumeDatasetDao.instance = new VolumeDatasetDao();
        }
        return VolumeDatasetDao.instance;
    }

}
