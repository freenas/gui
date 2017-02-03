import {AbstractRepository} from './abstract-repository-ng';
import {ModelEventName} from '../model-event-name';
import {Map} from 'immutable';
import {AbstractDao} from '../dao/abstract-dao';

export abstract class AbstractModelRepository extends AbstractRepository {
    protected localState: Map<string, Map<string, any>>;
    private modelEventName: ModelEventName;

    protected constructor(protected dao: AbstractDao) {
        super([dao.objectType]);
        this.modelEventName = ModelEventName[dao.objectType];
    }

    public getEmptyList() {
        return this.dao.getEmptyList();
    }

    protected handleStateChange(name: string, state: any) {
        this.localState = this.dispatchModelEvents(this.localState, this.modelEventName, state);
    }

    protected handleEvent(name: string, data: any) {
    }
}
