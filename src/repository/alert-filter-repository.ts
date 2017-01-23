import {AbstractRepository} from './abstract-repository-ng';
import {Model} from '../model';
import {Map} from 'immutable';
import {ModelEventName} from '../model-event-name';
import {AlertFilterDao} from '../dao/alert-filter-dao';

export class AlertFilterRepository extends AbstractRepository {
    private static instance: AlertFilterRepository;
    private alertFilters: Map<string, Map<string, any>>;

    private constructor(private alertFilterDao: AlertFilterDao) {
        super([Model.AlertFilter]);
    }

    public static getInstance(): AlertFilterRepository {
        if (!AlertFilterRepository.instance) {
            AlertFilterRepository.instance = new AlertFilterRepository(
                new AlertFilterDao()
            );
        }
        return AlertFilterRepository.instance;
    }

    public getNewAlertFilter() {
        return this.alertFilterDao.getNewInstance();
    }

    public listAlertFilters() {
        return this.alertFilterDao.list();
    }

    protected handleStateChange(name: string, state: any) {
        this.alertFilters = this.dispatchModelEvents(this.alertFilters, ModelEventName.AlertFilter, state);
    }

    protected handleEvent(name: string, data: any) {
    }
}
