import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class DirectoryserviceConfigDao extends AbstractDao {

    public constructor() {
        super(Model.DirectoryserviceConfig, {
            queryMethod: 'directoryservice.get_config'
        });
    }

}
