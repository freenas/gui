import {AbstractDao} from "./abstract-dao";

export class CalendarTaskDao extends AbstractDao {
    public constructor() {
        super('CalendarTask', {
            queryMethod: 'calendar_task.query',
            updateMethod: 'calendar_task.update',
            createMethod: 'calendar_task.create',
            eventName: 'entity-subscriber.calendar_task.changed'
        });
    }
}
