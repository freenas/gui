import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class NetworkInterfaceLaggPropertiesDao extends AbstractDao {
    public constructor() {
        super(Model.NetworkInterfaceLaggProperties);
    }
}
