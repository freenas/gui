import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class TunableDao extends AbstractDao {
    public constructor() {
        super(Model.Tunable);
    }
}
