"use strict";
var immutable = require("immutable");
var NullProcessor = (function () {
    function NullProcessor() {
    }
    NullProcessor.prototype.process = function (object, propertyDescriptors) {
        var processed = new Map(), keys = Object.keys(object), value;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var property = keys_1[_i];
            value = object[property];
            if (value || typeof value !== 'object') {
                processed.set(property, value);
            }
        }
        return processed.size > 0 ? immutable.Map(processed).toJS() : null;
    };
    return NullProcessor;
}());
var processor = new NullProcessor();
exports.processor = processor;
