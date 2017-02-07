import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {CalendarTask} from '../model/CalendarTask';

export class CalendarTaskDao extends AbstractDao<CalendarTask> {
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
