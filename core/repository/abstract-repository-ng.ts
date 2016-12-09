import { EventDispatcherService } from 'core/service/event-dispatcher-service';
import * as immutable from 'immutable';
import {ModelEventName} from "../model-event-name";
import {Map} from "immutable";

export abstract class AbstractRepository {
    protected previousState: immutable.Map<string, immutable.Map<string, Map<string, any>>>;
    protected eventDispatcherService: EventDispatcherService;

    protected constructor(subscribedStateChanges: Array<string> = [], subscribedEvents: Array<string> = []) {
        let self = this;
        this.eventDispatcherService = EventDispatcherService.getInstance();
        for (let subscribedStateChange of subscribedStateChanges) {
            this.eventDispatcherService.addEventListener('stateChange', function(data) {
                self.dispatchStateChange(subscribedStateChange, data)
            });
        }
        for (let subscribedEvent of subscribedEvents) {
            this.eventDispatcherService.addEventListener(subscribedEvent, function(data) {
                self.handleEvent(subscribedEvent, data)
            });
        }
    }

    private dispatchStateChange(name: string, state: any) {
        if (state.has(name)) {
            if (!this.previousState || this.previousState.get(name) !== state.get(name)) {
                this.handleStateChange(name, state.get(name));
                this.previousState = state
            }
        }
    }

    protected dispatchModelEvents(repositoryEntries: Map<string, Map<string, any>>, modelEventName: ModelEventName, state: any) {
        let self = this;
        this.eventDispatcherService.dispatch(modelEventName.listChange, state);
        state.forEach(function(stateEntry, id){
            if (!repositoryEntries || !repositoryEntries.has(id)) {
                self.eventDispatcherService.dispatch(modelEventName.add(id), stateEntry);
            } else if (repositoryEntries.get(id) !== stateEntry) {
                self.eventDispatcherService.dispatch(modelEventName.change(id), stateEntry);
            }
        });
        if (repositoryEntries) {
            repositoryEntries.forEach(function(repositoryEntry, id){
                if (!state.has(id) || state.get(id) !== repositoryEntry) {
                    self.eventDispatcherService.dispatch(modelEventName.remove(id), repositoryEntry);
                }
            });
        }
        return state;
    }

    protected abstract handleStateChange(name: string, data: any);
    protected abstract handleEvent(name: string, data: any);
}
