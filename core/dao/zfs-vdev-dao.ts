import {AbstractDao} from './abstract-dao';
import {Model} from '../model';

export class ZfsVdevDao extends AbstractDao {
    public constructor() {
        super(Model.ZfsVdev);
    }
}
