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

    public list() {
        return this.localState ? this.localState.valueSeq().toJS() : this.dao.list();
    }

    public save(dataObject: any, args?: any) {
        return this.dao.save(dataObject, args);
    }

    protected handleStateChange(name: string, state: any) {
        this.localState = this.dispatchModelEvents(this.localState, this.modelEventName, state);
    }

    protected handleEvent(name: string, data: any) {
    }
}
