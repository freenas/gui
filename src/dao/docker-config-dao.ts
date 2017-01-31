import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {DockerConfig} from '../model/DockerConfig';

export class DockerConfigDao extends AbstractDao<DockerConfig> {

    public constructor() {
        super(Model.DockerConfig, {
            queryMethod: 'docker.config.get_config'
        });
    }

}
