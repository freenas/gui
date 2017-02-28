import {AbstractModelRepository} from './abstract-model-repository';
import {RsyncdModule} from '../model/RsyncdModule';
import {RsyncdModuleDao} from '../dao/rsyncd-module-dao';

export class RsyncdModuleRepository extends AbstractModelRepository<RsyncdModule> {
    private static instance: RsyncdModuleRepository;

    private constructor(private rsyncdModuleDao: RsyncdModuleDao) {
        super(rsyncdModuleDao);
    }

    public static getInstance() {
        if (!RsyncdModuleRepository.instance) {
            RsyncdModuleRepository.instance = new RsyncdModuleRepository(
                new RsyncdModuleDao()
            );
        }
        return RsyncdModuleRepository.instance;
    }
}
