import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {AccountCategory} from '../model/AccountCategory';

export class AccountCategoryDao extends AbstractDao<AccountCategory> {

    public constructor() {
        super(Model.AccountCategory);
    }

}


