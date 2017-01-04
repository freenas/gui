import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class DiskDao extends AbstractDao {

    public constructor() {
        super(Model.Disk);
    }

}


