import { AbstractDao } from './abstract-dao';

export class SystemDatasetDao extends AbstractDao<any> {

    public constructor() {
        super('SystemDataset', {
            typeName: 'SystemDataset',
            queryMethod: 'system_dataset.status'
        });
    }

}

