import { AbstractDao } from './abstract-dao-ng';

export class DockerConfigDao extends AbstractDao {

    public constructor() {
        super('DockerConfig', {
            queryMethod: 'docker.config.get_config'
        });
    }

}
