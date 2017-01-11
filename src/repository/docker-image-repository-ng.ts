import {AbstractModelRepository} from './abstract-model-repository';
import {Model} from '../model';

export class DockerImageRepository extends AbstractModelRepository {
    private static instance: DockerImageRepository;

    private constructor() {
        super(Model.DockerImage);
    }

    public static getInstance(): DockerImageRepository {
        if (!DockerImageRepository.instance) {
            DockerImageRepository.instance = new DockerImageRepository();
        }
        return DockerImageRepository.instance;
    }
}
