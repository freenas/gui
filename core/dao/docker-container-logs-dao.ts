import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DockerContainerLogsDao extends AbstractDao {
    public constructor() {
        super(Model.DockerContainerLogs);
    }
}
