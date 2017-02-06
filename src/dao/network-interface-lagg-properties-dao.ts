import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {NetworkInterfaceLaggProperties} from '../model/NetworkInterfaceLaggProperties';

export class NetworkInterfaceLaggPropertiesDao extends AbstractDao<NetworkInterfaceLaggProperties> {
    public constructor() {
        super(Model.NetworkInterfaceLaggProperties);
    }
}
