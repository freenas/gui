import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class GroupDao extends AbstractDao {

    public constructor() {
        super(Model.Group);
    }

}

