import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {DockerImageReadme} from '../model/DockerImageReadme';

export class DockerImageReadmeDao extends AbstractDao<DockerImageReadme> {
    public constructor() {
        super(Model.DockerImageReadme);
    }

}
