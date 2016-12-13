import { AbstractDao } from './abstract-dao-ng';
import * as Promise from "bluebird";

export class AlertDao extends AbstractDao {

    public constructor() {
        super('Alert');
    }

    public dismiss(alert: any): Promise<any> {
        return this.middlewareClient.callRpcMethod('alert.dismiss', [alert.id]);
    }
}

