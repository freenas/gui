import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {AccountSystem} from '../model/AccountSystem';

export class AccountSystemDao extends AbstractDao<AccountSystem> {

    public constructor() {
        super(Model.AccountSystem);
    }

}


