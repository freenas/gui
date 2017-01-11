import {AbstractDao} from './abstract-dao';
import {Model} from '../model';

export class DockerCollectionDao extends AbstractDao {
    public constructor() {
        super(Model.DockerCollection, {
            eventName: 'entity-subscriber.docker.collection.changed'
        });
    }

    public getImages (collection) {
        return this.middlewareClient.callRpcMethod('docker.collection.get_entries', [collection.id]);
    }
}
