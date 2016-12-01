import * as immutable from 'immutable';

export function saveObject(previousState, action): immutable.Map<string, any> {
    var type = action.meta.type,
        id = action.meta.id,
        object = immutable.fromJS(action.payload).set('_objectType', type),
        typeState = previousState.has(type) ? previousState.get(type).set(id, object) : immutable.Map<string, any>().set(id, object);
    
    return previousState.set(type, typeState);
}
