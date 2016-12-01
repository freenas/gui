import { AbstractDao } from './abstract-dao-ng';

export class VolumeSnapshotDao extends AbstractDao {
    private static instance: VolumeSnapshotDao;

    private constructor() {
        super(AbstractDao.Model.VolumeSnapshot, {
            eventName: 'entity-subscriber.volume.snapshot.changed'
        });
    }

    public static getInstance() {
        if (!VolumeSnapshotDao.instance) {
            VolumeSnapshotDao.instance = new VolumeSnapshotDao();
        }
        return VolumeSnapshotDao.instance;
    }

}

