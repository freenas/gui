import { AbstractDao } from './abstract-dao-ng';

export class DirectoryServicesDao extends AbstractDao {

    public constructor() {
        super('DirectoryServices', {
            queryMethod: 'directory.query'
        });
    }

}
