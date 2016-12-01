import {AbstractRepository} from "./abstract-repository-ng";
import {BootPoolDao} from "../dao/boot-pool-dao";
import {BootEnvironmentDao} from "../dao/boot-environment-dao";

export class BootPoolRepository extends AbstractRepository{
    private static instance: BootPoolRepository;

    private bootEnvironments: Map<string, Map<string, any>>;

    private constructor(
        private bootPoolDao: BootPoolDao,
        private bootEnvironmentDao: BootEnvironmentDao
    ) {
        super([
            'BootEnvironment'
        ]);
    }

    public static getInstance() {
        if (!BootPoolRepository.instance) {
            BootPoolRepository.instance = new BootPoolRepository(
                BootPoolDao.getInstance(),
                BootEnvironmentDao.getInstance()
            );
        }
        return BootPoolRepository.instance;
    }

    public getBootPoolConfig(): Promise<Object> {
        return this.bootPoolDao.getConfig();
    }

    public listBootEnvironments(): Promise<Array<Object>> {
        return this.bootEnvironmentDao.list();
    }

    public deleteBootEnvironment(bootEnvironment: Object) {
        return this.bootEnvironmentDao.delete(bootEnvironment);
    }

    public scrubBootPool() {
        return this.bootPoolDao.scrub();
    }

    public activateBootEnvironment(bootEnvironment) {
        return this.bootEnvironmentDao.activate(bootEnvironment);
    }

    public saveBootEnvironment(bootEnvironment: Object) {
        return this.bootEnvironmentDao.save(bootEnvironment);
    }

    public cloneBootEnvironment(bootEnvironment: Object, cloneName: string) {
        return this.bootEnvironmentDao.clone(bootEnvironment, cloneName);
    }

    protected handleStateChange(name: string, state: any) {
        let self = this;
        switch (name) {
            case 'BootEnvironment':
                this.eventDispatcherService.dispatch('bootEnvironmentsChange', state);
                state.forEach(function(bootEnvironment, id){
                    if (!self.bootEnvironments || !self.bootEnvironments.has(id)) {
                        self.eventDispatcherService.dispatch('bootEnvironmentAdd.' + id, bootEnvironment);
                    } else if (self.bootEnvironments.get(id) !== bootEnvironment) {
                        self.eventDispatcherService.dispatch('bootEnvironmentChange.' + id, bootEnvironment);
                    }
                });
                if (this.bootEnvironments) {
                    this.bootEnvironments.forEach(function(bootEnvironment, id){
                        if (!state.has(id) || state.get(id) !== bootEnvironment) {
                            self.eventDispatcherService.dispatch('bootEnvironmentRemove.' + id, bootEnvironment);
                        }
                    });
                }
                this.bootEnvironments = state;
                break;
            default:
                break;
        }
    }
}


