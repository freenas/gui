"use strict";
var immutable = require("immutable");
var CleaningProcessor = (function () {
    function CleaningProcessor() {
    }
    CleaningProcessor.prototype.process = function (object, propertyDescriptors) {
        var processed = new Map(), keys = Object.keys(object), value, propertyDescriptor;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var property = keys_1[_i];
            if (!propertyDescriptors || propertyDescriptors.has(property)) {
                value = object[property];
                propertyDescriptor = propertyDescriptors && propertyDescriptors.get(property);
                if (this.isValidProperty(property, value, propertyDescriptor)) {
                    if (!value || typeof value !== 'object') {
                        processed.set(property, value);
                    }
                    else {
                        var processedChild = this.process(value);
                        if (processedChild) {
                            processed.set(property, processedChild);
                        }
                    }
                }
            }
        }
        return processed.size > 0 ?
            Array.isArray(object) ?
                immutable.Map(processed).toArray() : immutable.Map(processed).toJS() :
            null;
    };
    CleaningProcessor.prototype.isValidProperty = function (property, value, descriptor) {
        return property &&
            property.length > 0 &&
            property[0] !== '_' &&
            CleaningProcessor.validPropertyRegex.test(property) &&
            typeof value !== 'function' &&
            (!descriptor || !descriptor.readOnly);
    };
    return CleaningProcessor;
}());
CleaningProcessor.validPropertyRegex = /[a-z0-9_]*/;
var processor = new CleaningProcessor();
exports.processor = processor;
