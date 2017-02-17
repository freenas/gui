import {Map} from 'immutable';

export function deleteOverlay(previousState, action): Map<string, any> {
    let type = action.meta.type,
        id = action.meta.id,
        taskId = action.meta.taskId,
        overlay = previousState.get('overlay');
    overlay = overlay.set(
        type,
        overlay.get(type).set(
            id,
            overlay.get(type).get(id).delete(taskId)
        )
    );

    return previousState.set('overlay', overlay);
}
