import {AbstractModelRepository} from './abstract-model-repository';
import {DockerCollectionDao} from '../dao/docker-collection-dao';
import * as _ from 'lodash';

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
        return this.dockerCollectionDao.getImages(collection).then(function (templates) {
            return _.filter(templates, (template) => {
                if (_.startsWith((template as any).name, collection.collection)) {
                    (template as any).name = _.replace((template as any).name, collection.collection + '/', '');
                    return template;
                }
                return false;
            });
        });
    }

    public listDockerCollections() {
        return this.dockerCollectionDao.list();
    }
}
