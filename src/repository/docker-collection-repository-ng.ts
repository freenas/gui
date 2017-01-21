import {AbstractModelRepository} from './abstract-model-repository';
import {DockerCollectionDao} from '../dao/docker-collection-dao';

export class DockerCollectionRepository extends AbstractModelRepository {
    private static instance: DockerCollectionRepository;

    private constructor(private dockerCollectionDao: DockerCollectionDao) {
        super(dockerCollectionDao);
    }

    public static getInstance(): DockerCollectionRepository {
        if (!DockerCollectionRepository.instance) {
            DockerCollectionRepository.instance = new DockerCollectionRepository(
                new DockerCollectionDao()
            );
        }
        return DockerCollectionRepository.instance;
    }

    public getNewDockerCollection() {
        return this.dockerCollectionDao.getNewInstance();
    }

    public getDockerImagesWithCollection(collection: any) {
        return this.dockerCollectionDao.getImages(collection);
    }

    public listDockerCollections() {
        return this.dockerCollectionDao.list();
    }
}
