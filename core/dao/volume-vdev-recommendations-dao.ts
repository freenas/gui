import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class VolumeVdevRecommendationsDao extends AbstractDao {

    public constructor() {
        super(Model.VolumeVdevRecommendations, {
            queryMethod: 'volume.vdev_recommendations'
        });
    }

}



