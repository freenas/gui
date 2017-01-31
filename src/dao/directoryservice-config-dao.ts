import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {DirectoryserviceConfig} from '../model/DirectoryserviceConfig';

export class DirectoryserviceConfigDao extends AbstractDao<DirectoryserviceConfig> {

    public constructor() {
        super(Model.DirectoryserviceConfig, {
            queryMethod: 'directoryservice.get_config'
        });
    }

}
