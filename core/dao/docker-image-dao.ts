import {AbstractDao} from "./abstract-dao";

export class DockerImageDao extends AbstractDao {
    public constructor() {
        super('DockerImage');
    }
}
