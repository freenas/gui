import * as immutable from 'immutable';

export function renameObject(previousState, action): immutable.Map<string, any> {
    let type = action.meta.type,
        oldId = action.meta.id,
        newId = action.payload,
        objectState = previousState.get(type).get(oldId)
            .set('id', newId)
            .set('_stableId', newId),
        typeState = previousState.get(type)
            .delete(oldId)
            .set(newId, objectState);

    return previousState.set(type, typeState);
}
