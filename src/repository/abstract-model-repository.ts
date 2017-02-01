import {Map} from 'immutable';
import {AbstractRepository} from './abstract-repository';
import {ModelEventName} from '../model-event-name';
import {AbstractDao} from '../dao/abstract-dao';
import {AbstractDataObject} from '../model/AbstractDataObject';
import {SubmittedTask} from '../model/SubmittedTask';

export abstract class AbstractModelRepository<T extends AbstractDataObject> extends AbstractRepository<T> {
    private localState: Map<string, Map<string, any>>;
    private modelEventName: ModelEventName;

    protected constructor(protected dao: AbstractDao<T>) {
        super([dao.objectType]);
        this.modelEventName = ModelEventName[dao.objectType];
    }

    public list(): Promise<Array<T>> {
        return this.localState ? Promise.resolve(this.localState.valueSeq().toJS()) : this.dao.list();
    }

    public save(object: T, args: Array<any>): Promise<SubmittedTask> {
        return this.dao.save(object, args);
    }

    public getEmptyList(): Promise<Array<T>> {
        return this.dao.getEmptyList();
    }

    protected handleStateChange(name: string, state: any) {
        this.localState = this.dispatchModelEvents(this.localState, this.modelEventName, state);
    }

    protected handleEvent(name: string, data: any) {
    }
}
