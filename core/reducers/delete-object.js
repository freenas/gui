"use strict";
var immutable = require("immutable");
function deleteObject(previousState, action) {
    var type = action.meta.type, id = action.meta.id, typeState = previousState.has(type) ? previousState.get(type).delete(id) : immutable.Map();
    return previousState.set(type, typeState);
}
exports.deleteObject = deleteObject;
