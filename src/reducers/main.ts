import * as immutable from 'immutable';
import { saveObject } from './save-object';
import { deleteObject } from './delete-object';
import { importObjects } from './import-objects';
import { saveStream } from './save-stream';

export const ACTIONS =  {
    SAVE_OBJECT: 'SAVE_OBJECT',
    SAVE_STREAM: 'SAVE_STREAM',
    DELETE_OBJECT: 'DELETE_OBJECT',
    IMPORT_OBJECTS: 'IMPORT_OBJECTS'
};

const ACTIONS_MAPPING: immutable.Map<string, Function> = immutable.Map<string, Function>({
    SAVE_OBJECT: saveObject,
    SAVE_STREAM: saveStream,
    DELETE_OBJECT: deleteObject,
    IMPORT_OBJECTS: importObjects
});

export function dispatchAction(previousState, action) {
    previousState = previousState;

    if (!previousState) {
        previousState = (immutable.Map<string, any>()).set("streams", immutable.Map<string, any>());
    }

    if (ACTIONS_MAPPING.has(action.type)) {
        return ACTIONS_MAPPING.get(action.type)(previousState, action);
    }
    return previousState;
}
