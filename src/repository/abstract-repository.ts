import {EventDispatcherService} from '../service/event-dispatcher-service';
import {ModelEventName} from '../model-event-name';
import {Map} from 'immutable';
import {ModelDescriptorService} from '../service/model-descriptor-service';
import {AbstractDataObject} from '../model/AbstractDataObject';

export abstract class AbstractRepository<T extends AbstractDataObject> {
    protected previousState: Map<string, Map<string, Map<string, any>>>;
    protected previousOverlay: Map<string, Map<string, Map<string, any>>>;
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
            let hasStateChanged = !this.previousState || this.previousState.get(name) !== state.get(name),
                hasOverlayChanged = state.has('overlay') && (!this.previousOverlay || this.previousOverlay.get(name) !== state.get('overlay').get(name));
            if (hasStateChanged || hasOverlayChanged) {
                this.previousState = state;
                this.previousOverlay = state.get('overlay');
                this.handleStateChange(name, state.get(name), this.previousOverlay && this.previousOverlay.get(name));
            }
        }
    }

    protected dispatchModelEvents(repositoryEntries: Map<string, Map<string, any>>, modelEventName: ModelEventName, state: Map<string, Map<string, any>>, overlay?: Map<string, Map<string, any>>) {
        let self = this,
            hasListContentChanged = false;
        this.eventDispatcherService.dispatch(modelEventName.listChange, state);
        state.forEach(function(stateEntry, id) {
            let overlaidEntry = (overlay && overlay.has(id)) ? stateEntry.mergeDeep(overlay.get(id)) : stateEntry;
            if (!repositoryEntries || !repositoryEntries.has(id)) {
                self.eventDispatcherService.dispatch(modelEventName.add(id), overlaidEntry);
                hasListContentChanged = true;
            } else if (repositoryEntries.get(id) !== stateEntry) {
                self.eventDispatcherService.dispatch(modelEventName.change(id), overlaidEntry);
            }
        });
        if (repositoryEntries) {
            repositoryEntries.forEach(function(repositoryEntry, id) {
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

    protected dispatchSingleObjectChange(repositoryEntry: Map<string, any>, modelEventName: ModelEventName, state: Map<string, any>) {
        let stateEntry = state.first();
        if (repositoryEntry !== stateEntry) {
            this.eventDispatcherService.dispatch(modelEventName.contentChange, stateEntry);
        }
        return stateEntry;
    }

    protected abstract handleStateChange(name: string, state: Map<string, Map<string, any>>, overlay?: Map<string, Map<string, any>>);
    protected abstract handleEvent(name: string, data: any);
}
