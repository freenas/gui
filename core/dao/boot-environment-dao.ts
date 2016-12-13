import { AbstractDao } from './abstract-dao-ng';

export class BootEnvironmentDao extends AbstractDao {

    public constructor() {
        super('BootEnvironment');
    }

    public activate(bootEnvironment: Object) {
        return this.middlewareClient.submitTask('boot.environment.activate', [bootEnvironment.persistedId]);
    }

    public clone(bootEnvironment: Object, cloneName: string) {
        return this.middlewareClient.submitTask('boot.environment.clone', [cloneName, bootEnvironment.persistedId]);
    }
}

