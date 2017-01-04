import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class SectionDao extends AbstractDao {

    public constructor() {
        super(Model.Section);
    }

}
