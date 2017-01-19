import {AbstractDao} from './abstract-dao';
import {Model} from '../model';

export class DockerCollectionDao extends AbstractDao {
    public constructor() {
        super(Model.DockerCollection, {
            eventName: 'entity-subscriber.docker.collection.changed'
        });
    }

    public getImages (collection) {
        return this.datastoreService.stream(Model.DockerImage, 'docker.collection.get_entries', 'name', [collection.id]).then((stream) => {
            let dataArray = stream.get('data').toJS();
            dataArray._objectType = Model.DockerImage;

            return dataArray;
        });
    }
}
