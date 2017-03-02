import * as immutable from 'immutable';
import {Task} from '../model/Task';

const MAX_TASK_COUNT = 100;

export function saveObject(previousState, action): immutable.Map<string, any> {
    let type = action.meta.type,
        id = action.meta.id,
        object = immutable.fromJS(action.payload)
            .set('_stableId', id)
            .set('_objectType', type),
        typeState = previousState.has(type) ? previousState.get(type).set(id, object) : immutable.Map<string, any>().set(id, object),
        streamStates = previousState.get('streams');

    streamStates.forEach((streamState, streamId) => {
        if (streamState.get('type') === type) {
            let key = streamStates.get(streamId).get('data').findKey((value) => {
                return value.get('id') === id;
            });

            if (key > -1) {
                streamStates = streamStates.set(streamId, streamState.set('data', streamState.get('data').set(key, object)));
            } else {
                streamStates = streamStates.set(streamId, streamState.set('data', streamState.get('data').push(object)));
            }
        }
    });

    if (type === Task.getClassName()) {
        if (typeState.size > MAX_TASK_COUNT) {
            typeState = typeState.takeLast(MAX_TASK_COUNT);
        }
    }

    return previousState.set(type, typeState).set('streams', streamStates);
}
