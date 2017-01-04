"use strict";
var immutable = require("immutable");
function saveObject(previousState, action) {
    var type = action.meta.type, id = action.meta.id, object = immutable.fromJS(action.payload).set('_objectType', type), typeState = previousState.has(type) ? previousState.get(type).set(id, object) : immutable.Map().set(id, object);
    return previousState.set(type, typeState);
}
exports.saveObject = saveObject;
