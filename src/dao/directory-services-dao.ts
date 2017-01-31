import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {DirectoryServices} from '../model/DirectoryServices';

export class DirectoryServicesDao extends AbstractDao<DirectoryServices> {

    public constructor() {
        super(Model.DirectoryServices, {
            queryMethod: 'directory.query'
        });
    }

}
