"use strict";
var Immutable = require("immutable");
function initialize(state, action) {
    if (action.type === '@@INIT') {
        return Immutable.Map();
    }
}
exports.initialize = initialize;
