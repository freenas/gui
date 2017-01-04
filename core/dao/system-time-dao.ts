import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class SystemTimeDao extends AbstractDao {


    public constructor() {
        super(Model.SystemTime, {
            queryMethod: 'system.time.get_config',
            preventQueryCaching: true
        });
    }

}

