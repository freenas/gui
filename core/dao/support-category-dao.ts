import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class SupportCategoryDao extends AbstractDao {

    public constructor() {
        super(Model.SupportCategory, {
            queryMethod: 'support.categories_no_auth'
        });
    }

}

