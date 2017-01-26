import {AbstractDao} from "./abstract-dao";
import {Model} from '../model';
export class AlertFilterDao extends AbstractDao {
    public constructor() {
        super(Model.AlertFilter, {
        	eventName: 'entity-subscriber.alert.filter.changed'
        });
    }
}
