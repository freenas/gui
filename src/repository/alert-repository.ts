import {AbstractRepository} from './abstract-repository';
import {ModelEventName} from '../model-event-name';
import {Map} from 'immutable';
import {AlertDao} from '../dao/alert-dao';
import {Model} from '../model';
import {Alert} from '../model/Alert';

export class AlertRepository extends AbstractRepository<Alert> {
    private static instance: AlertRepository;

    private alerts: Map<string, Map<string, any>>;

    private constructor(private alertDao: AlertDao) {
        super([Model.Alert]);
    }

    public static getInstance() {
        if (!AlertRepository.instance) {
            AlertRepository.instance = new AlertRepository(
                new AlertDao()
            );
        }
        return AlertRepository.instance;
    }

    public listAlerts(): Promise<Array<Object>> {
        return this.alerts ? Promise.resolve(this.alerts.valueSeq().toJS()) : this.alertDao.find({active: true, dismissed: false});
    }

    public dismissAlert(alert: Alert): Promise<any> {
        return this.alertDao.dismiss(alert);
    }

    public dismissAlerts(alerts: Array<Alert>): Promise<any> {
        return this.alertDao.dismiss(alerts);
    }

    public dismissAll(): Promise<any> {
        return this.alertDao.dismissAll();
    }

    public listAlertClasses(): Promise<Array<any>> {
        return this.alertDao.listAlertClasses();
    }

    public listAlertEmitters(): Promise<Array<any>> {
        return this.alertDao.listAlertEmitters();
    }

    public listAlertSeverities(): Promise<Array<any>> {
        return this.alertDao.listAlertSeverities();
    }

    protected handleStateChange(name: string, state: any) {
        this.alerts = this.dispatchModelEvents(this.alerts, ModelEventName.Alert, state);
    }

    protected handleEvent(name: string, data: any) {
    }
}
