import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {SupportCategory} from '../model/SupportCategory';

export class SupportCategoryDao extends AbstractDao<SupportCategory> {

    public constructor() {
        super(Model.SupportCategory, {
            queryMethod: 'support.categories_no_auth'
        });
    }

}

