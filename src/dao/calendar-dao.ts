import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {Calendar} from '../model/Calendar';

export class CalendarDao extends AbstractDao<Calendar> {
    public constructor() {
        super(Model.Calendar);
    }
}
