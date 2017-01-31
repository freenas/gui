import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {VolumeVdevRecommendations} from '../model/VolumeVdevRecommendations';

export class VolumeVdevRecommendationsDao extends AbstractDao<VolumeVdevRecommendations> {

    public constructor() {
        super(Model.VolumeVdevRecommendations, {
            queryMethod: 'volume.vdev_recommendations'
        });
    }

}



