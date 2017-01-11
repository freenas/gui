import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class NetworkRouteDao extends AbstractDao {
    public constructor() {
        super(Model.NetworkRoute);
    }
}
