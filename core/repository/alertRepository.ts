import {AbstractRepository} from "./abstract-repository-ng";
import {ModelEventName} from "../model-event-name";
import {Map} from "immutable";
import {AlertDao} from "../dao/alert-dao";
import * as Promise from "bluebird";

export class AlertRepository extends AbstractRepository {
    private static instance: AlertRepository;

    private alerts: Map<string, Map<string, any>>;

    private constructor(private alertDao: AlertDao) {
        super([
            'Alert'
        ]);
    }

    public static getInstance() {
        if (!AlertRepository.instance) {
            AlertRepository.instance = new AlertRepository(
                AlertDao.getInstance()
            );
        }
        return AlertRepository.instance;
    }

    public listAlerts(): Promise<Array<Object>> {
        return this.alertDao.list();
    }

    public dismissAlert(alert: any): Promise<any> {
        return this.alertDao.dismiss(alert);
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'Alert':
                this.alerts = this.dispatchModelEvents(this.alerts, ModelEventName.Alert, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }
}
