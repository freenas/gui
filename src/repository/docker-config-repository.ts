import {AbstractModelRepository} from './abstract-model-repository';
import {DockerConfigDao} from '../dao/docker-config-dao';

export class DockerConfigRepository extends AbstractModelRepository {
    private static instance: DockerConfigRepository;

    private constructor(private dockerConfigDao: DockerConfigDao) {
        super(dockerConfigDao);
    }

    public static getInstance(): DockerConfigRepository{
        if (!DockerConfigRepository.instance) {
            DockerConfigRepository.instance = new DockerConfigRepository(
                new DockerConfigDao()
            );
        }
        return DockerConfigRepository.instance;
    }

    // FIXME: Rename / remove
    public getDockerContainerSettings() {
        return this.dockerConfigDao.get();
    }

    // FIXME: Rename
    public saveSettings(dockerConfig: any) {
        return this.dockerConfigDao.save(dockerConfig);
    }
}
