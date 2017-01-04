import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class DirectoryDao extends AbstractDao {

    public constructor() {
        super(Model.Directory);
    }

}
