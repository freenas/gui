import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {AccountSystem} from '../model/AccountSystem';

export class AccountSystemDao extends AbstractDao {

    public constructor() {
        super(Model.AccountSystem);
    }

}


