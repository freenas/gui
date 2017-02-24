import {AbstractDao} from './abstract-dao';
import {WinbindDirectoryParams} from '../model/WinbindDirectoryParams';
export class WinbindDirectoryParamsDao extends AbstractDao<WinbindDirectoryParams> {
    public constructor() {
        super(WinbindDirectoryParams.getClassName());
    }
}
