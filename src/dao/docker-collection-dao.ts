import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {DockerCollection} from '../model/DockerCollection';

export class DockerCollectionDao extends AbstractDao<DockerCollection> {
    public constructor() {
        super(Model.DockerCollection, {
            eventName: 'entity-subscriber.docker.collection.changed'
        });
    }

    public getImages(collection: DockerCollection) {
        return this.datastoreService.stream(Model.DockerCollectionImage, 'docker.collection.get_entries', 'name', [collection.id]).then((stream) => {
            let dataArray = stream.get('data').toJS();
            dataArray._objectType = Model.DockerCollectionImage;

            return dataArray;
        });
    }
}
