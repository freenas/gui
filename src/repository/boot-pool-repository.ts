import {AbstractRepository} from "./abstract-repository-ng";
import {BootPoolDao} from "../dao/boot-pool-dao";
import {BootEnvironmentDao} from "../dao/boot-environment-dao";
import {Map} from "immutable";
import {Model} from "../model";
import {ModelEventName} from "../model-event-name";

export class BootPoolRepository extends AbstractRepository{
    private static instance: BootPoolRepository;
    private bootEnvironments: Map<string, Map<string, any>>;

    private constructor(
        private bootPoolDao: BootPoolDao,
        private bootEnvironmentDao: BootEnvironmentDao
    ) {
        super([Model.BootEnvironment]);
    }

    public static getInstance() {
        if (!BootPoolRepository.instance) {
            BootPoolRepository.instance = new BootPoolRepository(
                new BootPoolDao(),
                new BootEnvironmentDao()
            );
        }
        return BootPoolRepository.instance;
    }

    public getBootPoolConfig(): Promise<Object> {
        return this.bootPoolDao.getConfig();
    }

    public listBootEnvironments(): Promise<Array<Object>> {
        return this.bootEnvironments ? Promise.resolve(this.bootEnvironments.valueSeq().toJS()) : this.bootEnvironmentDao.list();
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
        this.bootEnvironments = this.dispatchModelEvents(this.bootEnvironments, ModelEventName.BootEnvironment, state);
    }

    protected handleEvent(name: string, data: any) {}
}


