import * as immutable from 'immutable';

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
            var key = streamStates.get(streamId).get('data').findKey((value) => {
                return value.get('id') === id;
            });

            if (key > -1) {
                streamStates = streamStates.set(streamId, streamState.set('data', streamState.get('data').set(key, object)));
            } else {
                streamStates = streamStates.set(streamId, streamState.set('data', streamState.get('data').push(object)));
            }
        }
    });

    return previousState.set(type, typeState).set('streams', streamStates);
}
