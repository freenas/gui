import { AbstractDao } from './abstract-dao';

export class ImportableDiskDao extends AbstractDao {

    public constructor() {
        super('ImportableDisk', {
            queryMethod: 'volume.find_media'
        });
    }

}

