import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {NetworkInterfaceVlanProperties} from '../model/NetworkInterfaceVlanProperties';

export class NetworkInterfaceVlanPropertiesDao extends AbstractDao<NetworkInterfaceVlanProperties> {
    public constructor() {
        super(Model.NetworkInterfaceVlanProperties);
    }
}
