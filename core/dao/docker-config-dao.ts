import { AbstractDao } from './abstract-dao';

export class DockerConfigDao extends AbstractDao {

    public constructor() {
        super('DockerConfig', {
            queryMethod: 'docker.config.get_config'
        });
    }

}
