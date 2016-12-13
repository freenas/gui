import { AbstractDao } from './abstract-dao-ng';

export class ImportableDiskDao extends AbstractDao {

    public constructor() {
        super('ImportableDisk', {
            queryMethod: 'volume.find_media'
        });
    }

}

