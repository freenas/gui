import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {VmReadme} from '../model/VmReadme';

export class VmReadmeDao extends AbstractDao<VmReadme> {
    public constructor() {
        super(Model.VmReadme);
    }
}
