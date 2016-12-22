"use strict";
var immutable = require("immutable");
var save_object_1 = require("./save-object");
var delete_object_1 = require("./delete-object");
var import_objects_1 = require("./import-objects");
exports.ACTIONS = {
    SAVE_OBJECT: 'SAVE_OBJECT',
    DELETE_OBJECT: 'DELETE_OBJECT',
    IMPORT_OBJECTS: 'IMPORT_OBJECTS'
};
var ACTIONS_MAPPING = immutable.Map({
    SAVE_OBJECT: save_object_1.saveObject,
    DELETE_OBJECT: delete_object_1.deleteObject,
    IMPORT_OBJECTS: import_objects_1.importObjects
});
function dispatchAction(previousState, action) {
    previousState = previousState || immutable.Map();
    if (ACTIONS_MAPPING.has(action.type)) {
        return ACTIONS_MAPPING.get(action.type)(previousState, action);
    }
    return previousState;
}
exports.dispatchAction = dispatchAction;
