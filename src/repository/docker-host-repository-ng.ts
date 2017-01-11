import {AbstractModelRepository} from './abstract-model-repository';
import {Model} from '../model';

export class DockerHostRepository extends AbstractModelRepository {
    private static instance: DockerHostRepository;

    private constructor() {
        super(Model.DockerHost);
    }

    public static getInstance(): DockerHostRepository {
        if (!DockerHostRepository.instance) {
            DockerHostRepository.instance = new DockerHostRepository();
        }
        return DockerHostRepository.instance;
    }
}
