import { DataProcessor } from './data-processor';
import * as _ from "lodash";
import {Map} from "immutable";

class CleaningProcessor implements DataProcessor {
    private static validPropertyRegex: RegExp = /^[a-z0-9%$][a-zA-Z0-9_]*$/;

    public process(object: Object, propertyDescriptors?: Map<string, Object>): Object {
        let processed = Map<string, any>(),
            keys = _.keysIn(object),
            value, propertyDescriptor;
        for (let property of keys) {
            if (!propertyDescriptors || propertyDescriptors.has(property)) {
                value = object[property];
                propertyDescriptor = propertyDescriptors && propertyDescriptors.get(property);
                if (CleaningProcessor.isValidProperty(property, value, propertyDescriptor)) {
                    processed = processed.set(property, this.cleanupValue(value));
                }
            }
        }

        return processed.size > 0 ?
            Array.isArray(object) ?
                processed.toArray() : processed.toJS() :
            null;
    }

    private cleanupValue(value) {
        let cleanedValue;
        if (!value || typeof value !== 'object') {
            cleanedValue = value;
        } else if (Array.isArray(value)) {
            cleanedValue = [];
            for (let entry of value) {
                cleanedValue.push(this.cleanupValue(entry));
            }
        } else {
            cleanedValue = this.process(value);
        }
        return cleanedValue;
    }

    private static isValidProperty(property: string, value: any, descriptor: any) {
        return  property &&
                property.length > 0 &&
                property[0] !== '_' &&
                property !== 'constructor' &&
                CleaningProcessor.validPropertyRegex.test(property) &&
                typeof value !== 'function' &&
                (!descriptor || !descriptor.readOnly);
    }
}

let processor: DataProcessor = new CleaningProcessor();
export { processor };
