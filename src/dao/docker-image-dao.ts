import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {DockerImage} from '../model/DockerImage';

export class DockerImageDao extends AbstractDao<DockerImage> {
    public constructor() {
        super(Model.DockerImage, {
            eventName: 'entity-subscriber.docker.image.changed',
            idPath: 'name'
        });
    }

    public readme(dockerImageName: any) {
        return this.middlewareClient.callRpcMethod('docker.image.readme', [dockerImageName]);
    }

    public pullToHost(imageName: string, hostId: string): Promise<any> {
        return this.middlewareClient.submitTask('docker.image.pull', [imageName, hostId]);
    }

    public deleteFromHost(imageId: string, hostId: string): Promise<any> {
        return this.middlewareClient.submitTask('docker.image.delete', [imageId, hostId]);
    }
}
