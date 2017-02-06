import { DataProcessor } from './data-processor';
import * as immutable from 'immutable';
import * as _ from 'lodash';

class NullProcessor implements DataProcessor {
    public process(object: Object, propertyDescriptors?: Map<string, Object>): Object {
        if (_.isEmpty(object)) {
            return null;
        }
        let processed = new Map<string, any>(),
            keys = _.keysIn(object),
            value;
        for (let property of keys) {
            value = object[property];
            let cleanupResult = this.cleanupValue(value);
            var cleanedValue = cleanupResult.cleanedValue;
            var hasValue = cleanupResult.hasValue;
            if (hasValue) {
                processed.set(property, cleanedValue);
            }

        }
        return processed.size > 0 ? immutable.Map(processed).toJS() : null;
    }

    private cleanupValue(value) {
        let cleanedValue,
            hasValue = false;
        if (typeof value === 'object') {
            if (value) {
                if (Array.isArray(value)) {
                    cleanedValue = [];
                    hasValue = true;
                    for (let entry of value) {
                        cleanedValue.push(this.cleanupValue(entry).cleanedValue);
                    }
                } else {
                    cleanedValue = this.process(value);
                    if (cleanedValue) {
                        hasValue = true;
                    }
                }
            }
        } else {
            hasValue = true
            cleanedValue = value;
        }
        return {cleanedValue: cleanedValue, hasValue: hasValue};
    }
}

let processor: DataProcessor = new NullProcessor();
export { processor };

