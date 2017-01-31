import {AbstractRepository} from './abstract-repository-ng';
import {TunableDao} from '../dao/tunable-dao';
import {Map} from 'immutable';
import {ModelEventName} from '../model-event-name';
import {Model} from '../model';

export class TunableRepository extends AbstractRepository {
    private static instance: TunableRepository;
    private tunables: Map<string, Map<string, any>>;

    private constructor(private tunableDao: TunableDao) {
        super([Model.Tunable]);
    }

    public static getInstance() {
        if (!TunableRepository.instance) {
            TunableRepository.instance = new TunableRepository(
                new TunableDao()
            );
        }
        return TunableRepository.instance;
    }

    public listTunables() {
        return this.tunables ? Promise.resolve(this.tunables.valueSeq().toJS()) : this.tunableDao.list();
    }

    public getNewTunable() {
        return this.tunableDao.getNewInstance();
    }

    protected handleStateChange(name: string, state: any) {
        this.tunables = this.dispatchModelEvents(this.tunables, ModelEventName.Tunable, state);
    }

    protected handleEvent(name: string, data: any) {}
}
