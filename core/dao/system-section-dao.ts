import { AbstractDao } from './abstract-dao-ng';
import * as systemSections from 'core/data/system-sections.json';

export class SystemSectionDao extends AbstractDao {

    public constructor() {
        super('SystemSection');
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
