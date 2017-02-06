import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {NetworkHost} from '../model/NetworkHost';

export class NetworkHostDao extends AbstractDao<NetworkHost> {
    public constructor() {
        super(Model.NetworkHost);
    }
}
