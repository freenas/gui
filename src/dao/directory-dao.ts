import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {Directory} from '../model/Directory';

export class DirectoryDao extends AbstractDao<Directory> {

    public constructor() {
        super(Model.Directory);
    }

}
