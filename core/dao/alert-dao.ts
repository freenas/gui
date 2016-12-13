import { AbstractDao } from './abstract-dao-ng';
import * as Promise from "bluebird";

export class AlertDao extends AbstractDao {
    private static instance: AlertDao;

    private constructor() {
        super(AbstractDao.Model.Alert);
    }

    public static getInstance() {
        if (!AlertDao.instance) {
            AlertDao.instance = new AlertDao();
        }
        return AlertDao.instance;
    }

    public dismiss(alert: any): Promise<any> {
        return this.middlewareClient.callRpcMethod('alert.dismiss', [alert.id]);
    }
}

