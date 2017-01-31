import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {Alert} from '../model/Alert';

export class AlertDao extends AbstractDao<Alert> {

    public constructor() {
        super(Model.Alert);
    }

    public dismiss(alert: any): Promise<any> {
        return this.middlewareClient.callRpcMethod('alert.dismiss', [alert.id]);
    }

    public listAlertClasses(): Promise<Array<any>> {
    	return this.middlewareClient.callRpcMethod('alert.get_alert_classes');
    }

    public listAlertSeverities(): Promise<Array<any>> {
    	return this.middlewareClient.callRpcMethod('alert.get_alert_severities');
    }
}

