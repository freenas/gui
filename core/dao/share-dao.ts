import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class ShareDao extends AbstractDao {

    public constructor() {
        super(Model.Share);
    }

}



