import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class NetworkInterfaceDao extends AbstractDao {
    public constructor() {
        super(Model.NetworkInterface);
    }
}
