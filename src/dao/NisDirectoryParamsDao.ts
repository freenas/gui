import {AbstractDao} from './abstract-dao';
import {NisDirectoryParams} from '../model/NisDirectoryParams';
export class NisDirectoryParamsDao extends AbstractDao<NisDirectoryParams> {
    public constructor() {
        super(NisDirectoryParams.getClassName());
    }
}
