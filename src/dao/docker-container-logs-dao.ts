import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {DockerContainerLogs} from '../model/DockerContainerLogs';

export class DockerContainerLogsDao extends AbstractDao<DockerContainerLogs> {
    public constructor() {
        super(Model.DockerContainerLogs);
    }
}
