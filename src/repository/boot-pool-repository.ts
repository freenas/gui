import {Map} from 'immutable';
import * as _ from 'lodash';
import {AbstractRepository} from './abstract-repository';
import {BootPoolDao} from '../dao/boot-pool-dao';
import {BootEnvironmentDao} from '../dao/boot-environment-dao';
import {Model} from '../model';
import {ModelEventName} from '../model-event-name';
import {BootEnvironment} from '../model/BootEnvironment';

export class BootPoolRepository extends AbstractRepository<BootEnvironment> {
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

    public listBootEnvironments() {
        return this.bootEnvironments;
    }

    public loadBootEnvironments(): Promise<any> {
        return this.bootEnvironments ? Promise.resolve() : this.bootEnvironmentDao.list();
    }

    public deleteBootEnvironment(bootEnvironment: BootEnvironment) {
        return this.bootEnvironmentDao.delete(bootEnvironment);
    }

    public scrubBootPool() {
        return this.bootPoolDao.scrub();
    }

    public activateBootEnvironment(bootEnvironment: BootEnvironment) {
        return this.bootEnvironmentDao.activate(bootEnvironment);
    }

    public saveBootEnvironment(bootEnvironment: BootEnvironment) {
        return this.bootEnvironmentDao.save(bootEnvironment);
    }

    public cloneBootEnvironment(bootEnvironment: BootEnvironment) {
        let cloneName = this.getCloneName(bootEnvironment);
        return this.bootEnvironmentDao.clone(bootEnvironment, cloneName);
    }

    protected handleStateChange(name: string, state: any, overlay: Map<string, Map<string, any>>) {
        this.bootEnvironments = this.dispatchModelEvents(this.bootEnvironments, ModelEventName.BootEnvironment, state, overlay);
    }

    protected handleEvent(name: string, data: any) {}

    private getCloneName(bootEnvironment: BootEnvironment): string {
        let commonPrefix = bootEnvironment.id + '-copy-',
            usedNames = _.filter((this.bootEnvironments.keySeq().toJS() as string[]), name => _.startsWith(commonPrefix)),
            lastUsedIndex = !usedNames.length ?
            0 :
            _.last(
                _.sortBy(
                    _.map(
                        usedNames,
                        name => _.toNumber(name.substring(commonPrefix.length))
                    )
                )
            );
        return commonPrefix + _.toString(lastUsedIndex + 1);
    }
}


