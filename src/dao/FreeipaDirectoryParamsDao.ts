import {AbstractDao} from './abstract-dao';
import {FreeipaDirectoryParams} from '../model/FreeipaDirectoryParams';
export class FreeipaDirectoryParamsDao extends AbstractDao<FreeipaDirectoryParams>{
    public constructor() {
        super(FreeipaDirectoryParams.getClassName());
    }
}
