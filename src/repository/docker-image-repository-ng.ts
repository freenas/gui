import {AbstractModelRepository} from './abstract-model-repository';
import {DockerImageDao} from '../dao/docker-image-dao';

export class DockerImageRepository extends AbstractModelRepository {
    private static instance: DockerImageRepository;

    private constructor(private dockerImageDao: DockerImageDao) {
        super(dockerImageDao);
    }

    public static getInstance(): DockerImageRepository {
        if (!DockerImageRepository.instance) {
            DockerImageRepository.instance = new DockerImageRepository(
                new DockerImageDao()
            );
        }
        return DockerImageRepository.instance;
    }

    public getNewDockerImage() {
        return this.dockerImageDao.getNewInstance();
    }

    public listDockerImages() {
        return this.dockerImageDao.list();
    }

    public getReadmeForDockerImage(imageName: string) {
        return this.dockerImageDao.readme(imageName);
    }

    public pullImageToHost(imageName: string, hostId: string|null) {
        return this.dockerImageDao.pullToHost(imageName, hostId);
    }

    public deleteImageFromHost(imageName: string, hostId: string|null) {
        return this.dockerImageDao.deleteFromHost(imageName, hostId);
    }
}
