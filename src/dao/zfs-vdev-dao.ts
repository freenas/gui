import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {ZfsVdev} from '../model/ZfsVdev';

export class ZfsVdevDao extends AbstractDao<ZfsVdev> {
    public constructor() {
        super(Model.ZfsVdev);
    }
}
