import { DataProcessor } from './data-processor';
import { DatastoreService } from '../datastore-service';
import * as _ from 'lodash';
import {Map, List} from 'immutable';

class DiffProcessor implements DataProcessor {
    private datastoreService: DatastoreService;

    public constructor(datastoreService?: DatastoreService) {
        this.datastoreService = datastoreService || DatastoreService.getInstance();
    }

    public process(object: Object, type: string, id: string, propertyDescriptors?: Map<string, Object>) {
        if (_.isEmpty(object)) {
            return null;
        }
        let state = this.datastoreService.getState(),
            reference = state.has(type) && state.get(type).has(id) && state.get(type).get(id).toJS();
        return this.getDifferences(object, reference, propertyDescriptors);
    }

    private getDifferences(object: Object, reference?: Object, propertyDescriptors?: any): Object {
        let differences;
        if (!reference) {
            differences = Map<string, any>(object);
        } else {
            let usedReference = propertyDescriptors || reference;
            differences = Map<string, any>();
            _.forEach(usedReference, (value, key) => {
                if (object.hasOwnProperty(key) && !_.isEqual(reference[key], object[key])) {
                    differences = differences.set(key, object[key]);
                }
            });
        }
        return differences.size > 0 ? differences.toJS() : null;
    }
}

let processor: DataProcessor = new DiffProcessor();
export { processor };
