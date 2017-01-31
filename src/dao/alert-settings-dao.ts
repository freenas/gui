import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {AlertSettings} from '../model/AlertSettings';

export class AlertSettingsDao extends AbstractDao<AlertSettings> {
    public constructor() {
        super(Model.AlertSettings);
    }
}
