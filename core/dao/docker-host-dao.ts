import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DockerHostDao extends AbstractDao {
    public constructor() {
        super(Model.DockerHost);
    }
}
