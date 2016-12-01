import { DataProcessor } from './data-processor';
import * as immutable from 'immutable';

class NullProcessor implements DataProcessor {
    public process(object: Object, propertyDescriptors?: Map<string, Object>): Object {
        let processed = new Map<string, any>(),
            keys = Object.keys(object),
            value;
        for (var property of keys) {
            value = object[property];
            if (value || typeof value !== 'object') {
                processed.set(property, value);
            }
        }
        return processed.size > 0 ? immutable.Map(processed).toJS() : null;
    }
}

let processor: DataProcessor = new NullProcessor();
export { processor };

