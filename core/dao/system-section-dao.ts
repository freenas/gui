import { AbstractDao } from './abstract-dao-ng';
import * as systemSections from 'core/data/system-sections.json';

export class SystemSectionDao extends AbstractDao {
    private static instance: SystemSectionDao;

    private constructor() {
        super(AbstractDao.Model.SystemSection);
    }

    public static getInstance() {
        if (!SystemSectionDao.instance) {
            SystemSectionDao.instance = new SystemSectionDao();
        }
        return SystemSectionDao.instance;
    }

    public list() {
        let self = this;
        return Promise.all(
            systemSections.map(function(definition, index) {
                return self.getNewInstance().then(function(systemSection) {
                    systemSection._isNew = false;
                    systemSection.identifier = definition.id;
                    systemSection.label = definition.label;
                    systemSection.icon = definition.icon;
                    systemSection.order = index;
                    return systemSection;
                });
            })
        );
    }
}
