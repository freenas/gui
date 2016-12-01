import { DataProcessor } from './data-processor';
import * as immutable from 'immutable';

import { DatastoreService } from 'core/service/datastore-service';

class DiffProcessor implements DataProcessor {
    private datastoreService: DatastoreService;

    public constructor(datastoreService?: DataProcessor) {
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

    private getDifferences(object: Object, reference: immutable.Map<string, any>): Object {
        let self = this,
            differences = new Map<string, any>();
        reference.forEach(function(value, key) {
            if (object.hasOwnProperty(key)) {
                if (value instanceof immutable.Map) {
                    let childDifferences = self.getDifferences(object[key], value);
                    if (childDifferences) {
                        differences = differences.set(key, childDifferences);
                    }
                } else if (value instanceof immutable.List || object[key] !== value) {
                    differences = differences.set(key, object[key]);
                }
            }
        });
        return differences.size > 0 ? immutable.Map(differences).toJS() : null;
    }
}

let processor: DataProcessor = new DiffProcessor();
export { processor };
