import {AbstractDao} from './abstract-dao';
import {Model} from '../model';

export class DockerImageDao extends AbstractDao {
    public constructor() {
        super(Model.DockerImage, {
            eventName: 'entity-subscriber.docker.image.changed'
        });
    }

    public readme(dockerImageName: any) {
        return this.middlewareClient.callRpcMethod('docker.image.readme', [dockerImageName]);
    }

}
