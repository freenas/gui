import {AbstractDao} from "./abstract-dao";

export class DockerContainerLogsDao extends AbstractDao {
    public constructor() {
        super('DockerContainerLogs');
    }
}
