import { AbstractDao } from './abstract-dao';

export class DirectoryServicesDao extends AbstractDao {

    public constructor() {
        super('DirectoryServices', {
            queryMethod: 'directory.query'
        });
    }

}
