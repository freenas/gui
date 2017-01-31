import {AbstractDao} from "./abstract-dao";
import {Model} from '../model';
import {AlertFilter} from '../model/AlertFilter';
export class AlertFilterDao extends AbstractDao<AlertFilter> {
    public constructor() {
        super(Model.AlertFilter, {
            eventName: 'entity-subscriber.alert.filter.changed'
        });
    }
}
