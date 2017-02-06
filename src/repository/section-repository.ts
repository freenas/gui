import {AbstractRepository} from './abstract-repository';
import {SectionDao} from '../dao/section-dao';
import {SectionSettingsDao} from '../dao/section-settings-dao';
import * as _ from 'lodash';

export class SectionRepository extends AbstractRepository {
    private static instance: SectionRepository;

    private constructor(private sectionDao: SectionDao,
                        private sectionSettingsDao: SectionSettingsDao) {
        super();
    }

    public static getInstance() {
        if (!SectionRepository.instance) {
            SectionRepository.instance = new SectionRepository(
                new SectionDao(),
                new SectionSettingsDao()
            );
        }
        return SectionRepository.instance;
    }

    public getNewSection() {
        return this.sectionDao.getNewInstance().then(section => _.assign(section, {_isNew: false}));
    }

    public getNewSectionSettings() {
        return this.sectionSettingsDao.getNewInstance().then(section => _.assign(section, {_isNew: false}));
    }

    protected handleStateChange(name: string, state: any) {
    }

    protected handleEvent(name: string, data: any) {
    }
}
