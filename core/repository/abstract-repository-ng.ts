import {EventDispatcherService} from '../service/event-dispatcher-service';
import {ModelEventName} from '../model-event-name';
import {Map} from 'immutable';
import {ModelDescriptorService} from '../service/model-descriptor-service';

export abstract class AbstractRepository {
    protected previousState: Map<string, Map<string, Map<string, any>>>;
    protected readonly eventDispatcherService = EventDispatcherService.getInstance();
    protected readonly modelDescriptorService =  ModelDescriptorService.getInstance();

    protected constructor(subscribedStateChanges: Array<string> = [], subscribedEvents: Array<string> = []) {
        let self = this;
        for (let subscribedStateChange of subscribedStateChanges) {
            this.eventDispatcherService.addEventListener('stateChange', function(data) {
                self.dispatchStateChange(subscribedStateChange, data);
            });
        }
        for (let subscribedEvent of subscribedEvents) {
            this.eventDispatcherService.addEventListener(subscribedEvent, function(data) {
                self.handleEvent(subscribedEvent, data);
            });
        }
    }

    private dispatchStateChange(name: string, state: any) {
        if (state.has(name)) {
            if (!this.previousState || this.previousState.get(name) !== state.get(name)) {
                this.previousState = state;
                this.handleStateChange(name, state.get(name));
            }
        }
    }

    protected dispatchModelEvents(repositoryEntries: Map<string, Map<string, any>>, modelEventName: ModelEventName, state: any) {
        let self = this,
            hasListContentChanged = false;
        this.eventDispatcherService.dispatch(modelEventName.listChange, state);
        state.forEach(function(stateEntry, id){
            if (!repositoryEntries || !repositoryEntries.has(id)) {
                self.eventDispatcherService.dispatch(modelEventName.add(id), stateEntry);
                hasListContentChanged = true;
            } else if (repositoryEntries.get(id) !== stateEntry) {
                self.eventDispatcherService.dispatch(modelEventName.change(id), stateEntry);
            }
        });
        if (repositoryEntries) {
            repositoryEntries.forEach(function(repositoryEntry, id){
                if (!state.has(id) || state.get(id) !== repositoryEntry) {
                    self.eventDispatcherService.dispatch(modelEventName.remove(id), repositoryEntry);
                    hasListContentChanged = true;
                }
            });
        }
        if (hasListContentChanged) {
            this.eventDispatcherService.dispatch(modelEventName.contentChange, state);
        }
        return state;
    }

    protected abstract handleStateChange(name: string, state: any);
    protected abstract handleEvent(name: string, data: any);
}
