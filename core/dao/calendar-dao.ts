import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class CalendarDao extends AbstractDao {
    public constructor() {
        super(Model.Calendar)
    }
}
