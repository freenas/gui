import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {DockerHost} from '../model/DockerHost';

export class DockerHostDao extends AbstractDao<DockerHost> {
    public constructor() {
        super(Model.DockerHost, {
            eventName: 'entity-subscriber.docker.host.changed'
        });
    }
}
