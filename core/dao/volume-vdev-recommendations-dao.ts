import { AbstractDao } from './abstract-dao';

export class VolumeVdevRecommendationsDao extends AbstractDao {

    public constructor() {
        super('VolumeVdevRecommendations', {
            queryMethod: 'volume.vdev_recommendations'
        });
    }

}



