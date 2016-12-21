import { DataProcessor } from './data-processor';
import * as immutable from 'immutable';
import * as _ from "lodash";

class NullProcessor implements DataProcessor {
    public process(object: Object, propertyDescriptors?: Map<string, Object>): Object {
        let processed = new Map<string, any>(),
            keys = _.keysIn(object),
            value;
        for (let property of keys) {
            value = object[property];
            if (typeof value === 'object') {
                if (value) {
                    let cleaned = this.process(value);
                    if (cleaned) {
                        processed.set(property, cleaned);
                    }
                }
            } else {
                processed.set(property, value);
            }
        }
        return processed.size > 0 ? immutable.Map(processed).toJS() : null;
    }
}

let processor: DataProcessor = new NullProcessor();
export { processor };

