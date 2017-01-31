import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {NetworkInterfaceBridgeProperties} from '../model/NetworkInterfaceBridgeProperties';

export class NetworkInterfaceBridgePropertiesDao extends AbstractDao<NetworkInterfaceBridgeProperties> {
    public constructor() {
        super(Model.NetworkInterfaceBridgeProperties);
    }
}
