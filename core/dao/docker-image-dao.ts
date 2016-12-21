import {AbstractDao} from "./abstract-dao-ng";

export class DockerImageDao extends AbstractDao {
    public constructor() {
        super('DockerImage');
    }
}
