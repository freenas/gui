import { AbstractDao } from './abstract-dao-ng';

export class VolumeVdevRecommendationsDao extends AbstractDao {
    private static instance: VolumeVdevRecommendationsDao;

    private constructor() {
        super(AbstractDao.Model.VolumeVdevRecommendations, {
            queryMethod: 'volume.vdev_recommendations'
        });
    }

    public static getInstance() {
        if (!VolumeVdevRecommendationsDao.instance) {
            VolumeVdevRecommendationsDao.instance = new VolumeVdevRecommendationsDao();
        }
        return VolumeVdevRecommendationsDao.instance;
    }

}



