import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class DockerConfigDao extends AbstractDao {

    public constructor() {
        super(Model.DockerConfig, {
            queryMethod: 'docker.config.get_config'
        });
    }

}
