import { DataProcessor } from './data-processor';
import * as _ from 'lodash';
import {Map} from 'immutable';

class TaskProcessor implements DataProcessor {
    public process(object: Object, taskDescriptor?: Map<string, any>): Object {
        if (_.isEmpty(object)) {
            return null;
        }
        let missing = _.clone(taskDescriptor.get('mandatory')),
            forbidden = taskDescriptor.get('forbidden'),
            cleaned = {};
        _.forEach(object, (value, property) => {
            if (!_.includes(forbidden, property)) {
                cleaned[property] = _.cloneDeep(value);
                _.pull(missing, property);
            }
        });
        return cleaned;
    }

}

let processor: DataProcessor = new TaskProcessor();
export { processor };
