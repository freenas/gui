import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class AlertDao extends AbstractDao {

    public constructor() {
        super(Model.Alert);
    }

    public dismiss(alert: any): Promise<any> {
        return this.middlewareClient.callRpcMethod('alert.dismiss', [alert.id]);
    }
}

