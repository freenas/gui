import { AbstractDao } from './abstract-dao-ng';

export class BootEnvironmentDao extends AbstractDao {
    private static instance: BootEnvironmentDao;

    private constructor() {
        super(AbstractDao.Model.BootEnvironment);
    }

    public static getInstance() {
        if (!BootEnvironmentDao.instance) {
            BootEnvironmentDao.instance = new BootEnvironmentDao();
        }
        return BootEnvironmentDao.instance;
    }

    public activate(bootEnvironment: Object) {
        return this.middlewareClient.submitTask('boot.environment.activate', [bootEnvironment.persistedId]);
    }

    public clone(bootEnvironment: Object, cloneName: string) {
        return this.middlewareClient.submitTask('boot.environment.clone', [cloneName, bootEnvironment.persistedId]);
    }
}

