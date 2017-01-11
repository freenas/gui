import * as immutable from 'immutable';

export function deleteObject(previousState, action): immutable.Map<string, any> {
    var type = action.meta.type,
        id = action.meta.id,
        typeState = previousState.has(type) ? previousState.get(type).delete(id) : immutable.Map<string, any>();
    
    return previousState.set(type, typeState);
}

