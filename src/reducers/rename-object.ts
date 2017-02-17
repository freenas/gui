import * as immutable from 'immutable';

export function renameObject(previousState, action): immutable.Map<string, any> {
    let type = action.meta.type,
        oldId = action.meta.id,
        newId = action.payload,
        overlay = previousState.get('overlay'),
        objectState = previousState.get(type).get(oldId)
            .set('id', newId)
            .set('_stableId', newId),
        typeState = previousState.get(type)
            .delete(oldId)
            .set(newId, objectState);

    if (overlay.has(type) && overlay.get(type).has(oldId)) {
        previousState = previousState.set(
            'overlay',
            overlay.set(
                type,
                overlay.get(type).set(
                    newId,
                    overlay.get(type).get(oldId)
                ).delete(oldId)
            )
        );
    }

    return previousState.set(type, typeState);
}
