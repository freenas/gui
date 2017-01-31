import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {Tunable} from '../model/Tunable';

export class TunableDao extends AbstractDao<Tunable> {
    public constructor() {
        super(Model.Tunable);
    }
}
