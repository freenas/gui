import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class ServiceDao extends AbstractDao {
    public constructor() {
        super(Model.Service);
    }
}
