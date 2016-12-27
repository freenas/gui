"use strict";
var immutable = require("immutable");
var save_object_1 = require("./save-object");
var delete_object_1 = require("./delete-object");
var import_objects_1 = require("./import-objects");
var save_stream_1 = require("./save-stream");
exports.ACTIONS = {
    SAVE_OBJECT: 'SAVE_OBJECT',
    SAVE_STREAM: 'SAVE_STREAM',
    DELETE_OBJECT: 'DELETE_OBJECT',
    IMPORT_OBJECTS: 'IMPORT_OBJECTS'
};
var ACTIONS_MAPPING = immutable.Map({
    SAVE_OBJECT: save_object_1.saveObject,
    SAVE_STREAM: save_stream_1.saveStream,
    DELETE_OBJECT: delete_object_1.deleteObject,
    IMPORT_OBJECTS: import_objects_1.importObjects
});
function dispatchAction(previousState, action) {
    previousState = previousState;
    if (!previousState) {
        previousState = (immutable.Map()).set("streams", immutable.Map());
    }
    if (ACTIONS_MAPPING.has(action.type)) {
        return ACTIONS_MAPPING.get(action.type)(previousState, action);
    }
    return previousState;
}
exports.dispatchAction = dispatchAction;
