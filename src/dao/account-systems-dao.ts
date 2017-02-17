import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class AccountSystemDao extends AbstractDao {

    public constructor() {
        super(Model.AccountSystem);
    }

}


