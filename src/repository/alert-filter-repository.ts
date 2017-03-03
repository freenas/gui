import {AlertFilterDao} from '../dao/alert-filter-dao';
import * as _ from 'lodash';
import {AlertFilter} from '../model/AlertFilter';
import {AbstractModelRepository} from './abstract-model-repository';
import {SubmittedTask} from '../model/SubmittedTask';

export class AlertFilterRepository extends AbstractModelRepository<AlertFilter> {
    private static instance: AlertFilterRepository;

    private constructor(private alertFilterDao: AlertFilterDao) {
        super(alertFilterDao);
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
        return this.getNewInstance()
            .then(alertFilter => _.assign(alertFilter, {predicates: []}));
    }

    public listAlertFilters() {
        return this.list();
    }

    public save(alertFilter: AlertFilter): Promise<SubmittedTask> {
        delete alertFilter.parameters.addresses;
        return super.save(alertFilter);
    }
}
