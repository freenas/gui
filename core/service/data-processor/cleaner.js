"use strict";
var _ = require("lodash");
var immutable_1 = require("immutable");
var CleaningProcessor = (function () {
    function CleaningProcessor() {
    }
    CleaningProcessor.prototype.process = function (object, propertyDescriptors) {
        var processed = immutable_1.Map(), keys = _.keysIn(object), value, propertyDescriptor;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var property = keys_1[_i];
            if (!propertyDescriptors || _.has(propertyDescriptors, property)) {
                value = object[property];
                propertyDescriptor = propertyDescriptors && _.get(propertyDescriptors, property);
                if (CleaningProcessor.isValidProperty(property, value, propertyDescriptor)) {
                    processed = processed.set(property, this.cleanupValue(value));
                }
            }
        }
        return processed.size > 0 ?
            Array.isArray(object) ?
                processed.toArray() : processed.toJS() :
            null;
    };
    CleaningProcessor.prototype.cleanupValue = function (value) {
        var cleanedValue;
        if (!value || typeof value !== 'object' || _.isEmpty(value)) {
            cleanedValue = value;
        }
        else if (Array.isArray(value)) {
            cleanedValue = [];
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var entry = value_1[_i];
                cleanedValue.push(this.cleanupValue(entry));
            }
        }
        else {
            cleanedValue = this.process(value);
        }
        return cleanedValue;
    };
    CleaningProcessor.isValidProperty = function (property, value, descriptor) {
        return property &&
            property.length > 0 &&
            property[0] !== '_' &&
            property !== 'constructor' &&
            CleaningProcessor.validPropertyRegex.test(property) &&
            typeof value !== 'function' &&
            (!descriptor || !descriptor.readOnly);
    };
    return CleaningProcessor;
}());
CleaningProcessor.validPropertyRegex = /^[a-z0-9%$][a-zA-Z0-9_]*$/;
var processor = new CleaningProcessor();
exports.processor = processor;
