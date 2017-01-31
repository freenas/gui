import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {Share} from '../model/Share';

export class ShareDao extends AbstractDao<Share> {

    public constructor() {
        super(Model.Share);
    }

}



