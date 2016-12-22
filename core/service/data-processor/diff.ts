import { DataProcessor } from './data-processor';
import * as immutable from 'immutable';

import { DatastoreService } from '../datastore-service';
import {Map} from "immutable";

class DiffProcessor implements DataProcessor {
    private datastoreService: DatastoreService;

    public constructor(datastoreService?: DatastoreService) {
        this.datastoreService = datastoreService || DatastoreService.getInstance();
    }

    public process(object: Object, type: string, id: string) {
        let changes,
            state = this.datastoreService.getState();
        if (state.get(type).has(id)) {
            let reference = state.get(type).get(id);
            changes = this.getDifferences(object, reference);
        } else {
            changes = object;
        }
        return changes;
    }

    private getDifferences(object: Object, reference: Map<string, any>): Object {
        let differences = Map<string, any>();
        reference.forEach(function(value, key) {
            if (object.hasOwnProperty(key) &&
                (value instanceof immutable.Map || value instanceof immutable.List || value !== object[key])) {
                differences = differences.set(key, object[key]);
            }
        });
        return differences.size > 0 ? differences.toJS() : null;
    }
}

let processor: DataProcessor = new DiffProcessor();
export { processor };
