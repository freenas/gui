import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {Service} from '../model/Service';

export class ServiceDao extends AbstractDao<Service> {
    public constructor() {
        super(Model.Service);
    }

    public readme(dockerImageName: any) {
        return this.middlewareClient.callRpcMethod('docker.image.readme', [dockerImageName]);
    }

}
