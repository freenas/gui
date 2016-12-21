import {AbstractDao} from "./abstract-dao-ng";

export class DockerImagePullDao extends AbstractDao {
    public constructor() {
        super('DockerImagePull');
    }
}
