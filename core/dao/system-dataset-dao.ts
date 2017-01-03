import { AbstractDao } from './abstract-dao';

export class SystemDatasetDao extends AbstractDao {

    public constructor() {
        super({}, {
            typeName: 'SystemDataset',
            queryMethod: 'system_dataset.status'
        });
    }

}

