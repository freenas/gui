import { AbstractDao } from './abstract-dao-ng';

export class DockerConfigDao extends AbstractDao {
    private static instance: DockerConfigDao;

    private constructor() {
        super(AbstractDao.Model.DockerConfig, {
            queryMethod: 'docker.config.get_config'
        });
    }

    public static getInstance() {
        if (!DockerConfigDao.instance) {
            DockerConfigDao.instance = new DockerConfigDao();
        }
        return DockerConfigDao.instance;
    }
}
