import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class NetworkHostDao extends AbstractDao {
    public constructor() {
        super(Model.NetworkHost);
    }
}
