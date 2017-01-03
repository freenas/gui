import {AbstractDao} from "./abstract-dao";

export class DockerImagePullDao extends AbstractDao {
    public constructor() {
        super('DockerImagePull');
    }
}
