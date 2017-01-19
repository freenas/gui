"use strict";
var immutable = require("immutable");
function saveStream(previousState, action) {
    var type = action.meta.type, streams = previousState.get("streams"), stream = immutable.fromJS(action.payload);
    return previousState.set("streams", streams.set(type, stream));
}
exports.saveStream = saveStream;
