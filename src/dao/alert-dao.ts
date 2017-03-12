import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {Alert} from '../model/Alert';
import * as _ from 'lodash';

export class AlertDao extends AbstractDao<Alert> {

    public constructor() {
        super(Model.Alert);
    }

    public dismiss(alert: Array<Alert>|Alert): Promise<any> {
        return this.middlewareClient.callRpcMethod('alert.dismiss', _.map(_.castArray(alert), 'id'));
    }

    public dismissAll(): Promise<any> {
        return this.middlewareClient.callRpcMethod('alert.dismiss_all');
    }

    public listAlertClasses(): Promise<Array<any>> {
        return this.middlewareClient.callRpcMethod('alert.get_alert_classes');
    }

    public listAlertEmitters(): Promise<Array<any>> {
        return this.middlewareClient.callRpcMethod('alert.emitter.query');
    }

    public listAlertSeverities(): Promise<Array<any>> {
        return this.middlewareClient.callRpcMethod('alert.get_alert_severities');
    }
}

