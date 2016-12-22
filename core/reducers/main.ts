import * as immutable from 'immutable';
import { saveObject } from './save-object';
import { deleteObject } from './delete-object';
import { importObjects } from './import-objects';

export const ACTIONS =  {
    SAVE_OBJECT: 'SAVE_OBJECT',
    DELETE_OBJECT: 'DELETE_OBJECT',
    IMPORT_OBJECTS: 'IMPORT_OBJECTS'
};

const ACTIONS_MAPPING: immutable.Map<string, Function> = immutable.Map<string, Function>({
    SAVE_OBJECT: saveObject,
    DELETE_OBJECT: deleteObject,
    IMPORT_OBJECTS: importObjects
});

export function dispatchAction(previousState, action) {
    previousState = previousState || immutable.Map<string, any>();
    if (ACTIONS_MAPPING.has(action.type)) {
        return ACTIONS_MAPPING.get(action.type)(previousState, action);
    }
    return previousState;
}
