import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class NetworkInterfaceBridgePropertiesDao extends AbstractDao {
    public constructor() {
        super(Model.NetworkInterfaceBridgeProperties);
    }
}
