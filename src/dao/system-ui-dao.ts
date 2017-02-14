import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {SystemUi} from '../model/SystemUi';

export class SystemUiDao extends AbstractDao<SystemUi> {
    public constructor() {
        super(Model.SystemUi, {
            queryMethod: 'system.ui.get_config'
        });
    }
}
