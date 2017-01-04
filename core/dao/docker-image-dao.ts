import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DockerImageDao extends AbstractDao {
    public constructor() {
        super(Model.DockerImage);
    }
}
