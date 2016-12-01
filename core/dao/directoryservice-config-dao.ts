import { AbstractDao } from './abstract-dao-ng';

export class DirectoryserviceConfigDao extends AbstractDao {
    private static instance: DirectoryserviceConfigDao;

    private constructor() {
        super(AbstractDao.Model.DirectoryserviceConfig, {
            queryMethod: 'directoryservice.get_config'
        });
    }

    public static getInstance() {
        if (!DirectoryserviceConfigDao.instance) {
            DirectoryserviceConfigDao.instance = new DirectoryserviceConfigDao();
        }
        return DirectoryserviceConfigDao.instance;
    }
}
