import {AbstractRepository} from './abstract-repository-ng';
import {ModelEventName} from '../model-event-name';
import {Map} from 'immutable';

export abstract class AbstractModelRepository extends AbstractRepository {
    private localState: Map<string, Map<string, any>>;
    private modelEventName: ModelEventName;

    protected constructor(model: string) {
        super([model]);
        this.modelEventName = ModelEventName[model];
    }

    protected handleStateChange(name: string, state: any) {
        this.localState = this.dispatchModelEvents(this.localState, this.modelEventName, state);
    }

    protected handleEvent(name: string, data: any) {
    }

}
