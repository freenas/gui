"use strict";
var immutable = require("immutable");
function importObjects(previousState, action) {
    var type = action.meta.type, typeState = previousState.has(type) ? previousState.get(type) : immutable.Map(), objectState;
    for (var _i = 0, _a = action.payload; _i < _a.length; _i++) {
        var object = _a[_i];
        typeState = typeState.set(object.id, immutable.Map(object).set('_objectType', type));
    }
    return previousState.set(type, typeState);
}
exports.importObjects = importObjects;
