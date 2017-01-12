import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DockerNetworkDao extends AbstractDao {
    public constructor() {
        super(Model.DockerNetwork, {
            eventName: 'entity-subscriber.docker.network.changed'
        });
    }

}
