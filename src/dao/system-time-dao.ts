import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {SystemTime} from '../model/SystemTime';

export class SystemTimeDao extends AbstractDao<SystemTime> {


    public constructor() {
        super(Model.SystemTime, {
            queryMethod: 'system.time.get_config',
            preventQueryCaching: true
        });
    }

}

