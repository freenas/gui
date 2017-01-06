"use strict";
var _ = require("lodash");
var TaskProcessor = (function () {
    function TaskProcessor() {
    }
    TaskProcessor.prototype.process = function (object, taskDescriptor) {
        var missing = _.clone(taskDescriptor.get('mandatory')), forbidden = taskDescriptor.get('forbidden'), cleaned = {};
        _.forEach(object, function (value, property) {
            if (!_.includes(forbidden, property)) {
                cleaned[property] = _.cloneDeep(value);
                _.pull(missing, property);
            }
        });
        return cleaned;
    };
    return TaskProcessor;
}());
var processor = new TaskProcessor();
exports.processor = processor;
