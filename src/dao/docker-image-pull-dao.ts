import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DockerImagePullDao extends AbstractDao {
    public constructor() {
        super(Model.DockerImagePull);
    }
}
