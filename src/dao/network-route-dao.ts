import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {NetworkRoute} from '../model/NetworkRoute';

export class NetworkRouteDao extends AbstractDao<NetworkRoute> {
    public constructor() {
        super(Model.NetworkRoute);
    }
}
