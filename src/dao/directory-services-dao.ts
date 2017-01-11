import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class DirectoryServicesDao extends AbstractDao {

    public constructor() {
        super(Model.DirectoryServices, {
            queryMethod: 'directory.query'
        });
    }

}
