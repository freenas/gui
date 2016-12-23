import {AbstractDao} from "./abstract-dao-ng";

export class DockerContainerLogsDao extends AbstractDao {
    public constructor() {
        super('DockerContainerLogs');
    }
}
