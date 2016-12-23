"use strict";
var immutable = require('immutable');
var _ = require("lodash");
var NullProcessor = (function () {
    function NullProcessor() {
    }
    NullProcessor.prototype.process = function (object, propertyDescriptors) {
        var processed = new Map(), keys = _.keysIn(object), value;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var property = keys_1[_i];
            value = object[property];
            var cleanupResult = this.cleanupValue(value);
            var cleanedValue = cleanupResult.cleanedValue;
            var hasValue = cleanupResult.hasValue;
            if (hasValue) {
                processed.set(property, cleanedValue);
            }
        }
        return processed.size > 0 ? immutable.Map(processed).toJS() : null;
    };
    NullProcessor.prototype.cleanupValue = function (value) {
        var cleanedValue, hasValue = false;
        if (typeof value === 'object') {
            if (value) {
                if (Array.isArray(value)) {
                    cleanedValue = [];
                    hasValue = true;
                    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                        var entry = value_1[_i];
                        cleanedValue.push(this.cleanupValue(entry).cleanedValue);
                    }
                }
                else {
                    cleanedValue = this.process(value);
                    if (cleanedValue) {
                        hasValue = true;
                    }
                }
            }
        }
        else {
            hasValue = true;
            cleanedValue = value;
        }
        return { cleanedValue: cleanedValue, hasValue: hasValue };
    };
    return NullProcessor;
}());
var processor = new NullProcessor();
exports.processor = processor;
