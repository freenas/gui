import {AbstractModelRepository} from './abstract-model-repository';
import {DockerImageReadmeDao} from '../dao/docker-image-readme-dao';

export class DockerImageReadmeRepository extends AbstractModelRepository {
    private static instance: DockerImageReadmeRepository;

    private constructor(private dockerImageReadmeDao: DockerImageReadmeDao) {
        super(dockerImageReadmeDao);
    }

    public static getInstance() {
        if (!DockerImageReadmeRepository.instance) {
            DockerImageReadmeRepository.instance = new DockerImageReadmeRepository(
                new DockerImageReadmeDao()
            );
        }
        return DockerImageReadmeRepository.instance;
    }

    public getDockerImageReadme() {
        return this.dockerImageReadmeDao.getNewInstance();
    }
}
