import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class NetworkInterfaceVlanPropertiesDao extends AbstractDao {
    public constructor() {
        super(Model.NetworkInterfaceVlanProperties);
    }
}
