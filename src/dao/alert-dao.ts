import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class AlertDao extends AbstractDao {

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

