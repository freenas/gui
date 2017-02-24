import {AlertEmitterDao} from '../dao/alert-emitter-dao';
import {AbstractModelRepository} from './abstract-model-repository';

export class AlertEmitterRepository extends AbstractModelRepository {
    private static instance: AlertEmitterRepository;

    private constructor(private alertEmitterDao: AlertEmitterDao) {
        super(alertEmitterDao);
    }

    public static getInstance() {
        if (!AlertEmitterRepository.instance) {
            AlertEmitterRepository.instance = new AlertEmitterRepository(
                new AlertEmitterDao()
            );
        }
        return AlertEmitterRepository.instance;
    }
}

