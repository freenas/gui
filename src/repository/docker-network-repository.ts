import {AbstractModelRepository} from './abstract-model-repository';
import {Model} from '../model';

export class DockerNetworkRepository extends AbstractModelRepository {
    private static instance: DockerNetworkRepository;

    private constructor() {
        super(Model.DockerNetwork);
    }

    public static getInstance(): DockerNetworkRepository {
        if (!DockerNetworkRepository.instance) {
            DockerNetworkRepository.instance = new DockerNetworkRepository();
        }
        return DockerNetworkRepository.instance;
    }
}
