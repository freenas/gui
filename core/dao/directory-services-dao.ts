import { AbstractDao } from './abstract-dao-ng';

export class DirectoryServicesDao extends AbstractDao {
    private static instance: DirectoryServicesDao;

    private constructor() {
        super(AbstractDao.Model.DirectoryServices, {
            queryMethod: 'directory.query'
        });
    }

    public static getInstance() {
        if (!DirectoryServicesDao.instance) {
            DirectoryServicesDao.instance = new DirectoryServicesDao();
        }
        return DirectoryServicesDao.instance;
    }
}
