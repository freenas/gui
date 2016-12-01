import { DataProcessor } from './data-processor';
import * as immutable from 'immutable';

class CleaningProcessor implements DataProcessor {
    private static validPropertyRegex: RegExp = /[a-z0-9_]*/;

    public process(object: Object, propertyDescriptors?: Map<string, Object>): Object {
        let processed = new Map<string, any>(),
            keys = Object.keys(object),
            value, propertyDescriptor;
        for (let property of keys) {
           if (!propertyDescriptors || propertyDescriptors.has(property)) {
                value = object[property];
                propertyDescriptor = propertyDescriptors && propertyDescriptors.get(property);
                if (this.isValidProperty(property, value, propertyDescriptor)) {
                    if (!value || typeof value !== 'object') {
                        processed.set(property, value);
                    } else {
                        let processedChild = this.process(value);
                        if (processedChild) {
                            processed.set(property, processedChild);
                        }
                    }
                }
            }
        }

        return processed.size > 0 ?
            Array.isArray(object) ?
                immutable.Map(processed).toArray() : immutable.Map(processed).toJS() :
            null;
    }

    private isValidProperty(property: string, value: any, descriptor: Object) {
        return  property &&
                property.length > 0 &&
                property[0] !== '_' &&
                CleaningProcessor.validPropertyRegex.test(property) &&
                typeof value !== 'function' &&
                (!descriptor || !descriptor.readOnly);
    }
}

let processor: DataProcessor = new CleaningProcessor();
export { processor };
