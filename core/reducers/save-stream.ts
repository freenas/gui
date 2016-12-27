import * as immutable from 'immutable';

export function saveStream(previousState, action): immutable.Map<string, any> {
    var type = action.meta.type,
        streams = previousState.get("streams"),
        stream = immutable.fromJS(action.payload);

    return previousState.set("streams", streams.set(type, stream));
}
