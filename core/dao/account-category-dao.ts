import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class AccountCategoryDao extends AbstractDao {

    public constructor() {
        super(Model.AccountCategory);
    }

}


