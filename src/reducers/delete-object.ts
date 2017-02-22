import * as immutable from 'immutable';

export function deleteObject(previousState, action): immutable.Map<string, any> {
    let type = action.meta.type,
        id = action.meta.id,
        typeState = previousState.has(type) ? previousState.get(type).delete(id) : immutable.Map<string, any>(),
        streamStates = previousState.get('streams');

    streamStates.forEach((streamState, streamId) => {
        if (streamState.get('type') === type) {
            let dataMap = streamState.get('data'),
                index = dataMap.findKey((value) => value.get('id') === id);

            if (index !== void 0) {
                streamStates = streamStates.set(streamId, streamState.set('data', dataMap.delete(index)));
            }
        }
    });

    return previousState.set(type, typeState).set('streams', streamStates);
}

