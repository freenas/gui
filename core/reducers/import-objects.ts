import * as immutable from 'immutable';

export function importObjects(previousState, action): immutable.Map<string, any> {
    let type = action.meta.type,
        typeState = previousState.has(type) ? previousState.get(type) : immutable.Map<string, any>(),
        objectState;
    
    for (var object of action.payload) {
        typeState = typeState.set(object.id, immutable.Map(object).set('_objectType', type));
    }

    return previousState.set(type, typeState);
}

