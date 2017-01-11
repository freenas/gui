import {AbstractModelRepository} from './abstract-model-repository';
import {Model} from '../model';

export class DockerContainerRepository extends AbstractModelRepository {
    private static instance: DockerContainerRepository;

    private constructor() {
        super(Model.DockerContainer);
    }

    public static getInstance(): DockerContainerRepository {
        if (!DockerContainerRepository.instance) {
            DockerContainerRepository.instance = new DockerContainerRepository();
        }
        return DockerContainerRepository.instance;
    }
}
