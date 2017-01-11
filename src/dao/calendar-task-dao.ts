import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class CalendarTaskDao extends AbstractDao {
    public constructor() {
        super(Model.CalendarTask, {
            queryMethod: 'calendar_task.query',
            updateMethod: 'calendar_task.update',
            createMethod: 'calendar_task.create',
            deleteMethod: 'calendar_task.delete',
            eventName: 'entity-subscriber.calendar_task.changed'
        });
    }
}
