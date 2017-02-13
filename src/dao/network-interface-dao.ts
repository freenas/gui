import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {NetworkInterface} from '../model/NetworkInterface';

export class NetworkInterfaceDao extends AbstractDao<NetworkInterface> {
    public constructor() {
        super(Model.NetworkInterface, {
            eventName: 'entity-subscriber.network.interface.changed'
        });
    }

    public renew(networkInterface: NetworkInterface) {
        return this.middlewareClient.submitTask('network.interface.renew', [networkInterface.id]);
    }
}
