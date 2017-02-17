import * as immutable from 'immutable';
import {Map} from 'immutable';

export function saveOverlay(previousState, action): Map<string, any> {
    let type = action.meta.type,
        id = action.meta.id,
        taskId = action.meta.taskId,
        object = immutable.fromJS(action.payload),
        overlay = previousState.get('overlay');

    if (!overlay.has(type)) {
        overlay = overlay.set(
                type,
                Map<string, Map<string, any>>().set(
                    id,
                    Map<string, Map<string, any>>().set(
                        taskId,
                        object
                    )
                )
        );
    } else if (!overlay.get(type).has(id)) {
        overlay = overlay.set(
            type,
            overlay.get(type).set(
                id,
                Map<string, Map<string, any>>().set(
                    taskId,
                    object
                )
            )
        );
    }

    return previousState.set('overlay', overlay);
}
