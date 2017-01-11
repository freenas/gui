import {AbstractModelRepository} from './abstract-model-repository';
import {Model} from '../model';

export class DockerCollectionRepository extends AbstractModelRepository {
    private static instance: DockerCollectionRepository;

    private constructor() {
        super(Model.DockerCollection);
    }

    public static getInstance(): DockerCollectionRepository {
        if (!DockerCollectionRepository.instance) {
            DockerCollectionRepository.instance = new DockerCollectionRepository();
        }
        return DockerCollectionRepository.instance;
    }
}
