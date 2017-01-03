"use strict";
var datastore_service_1 = require('../datastore-service');
var immutable_1 = require("immutable");
var DiffProcessor = (function () {
    function DiffProcessor(datastoreService) {
        this.datastoreService = datastoreService || datastore_service_1.DatastoreService.getInstance();
    }
    DiffProcessor.prototype.process = function (object, type, id) {
        var changes, state = this.datastoreService.getState();
        if (state.get(type).has(id)) {
            var reference = state.get(type).get(id);
            changes = this.getDifferences(object, reference);
        }
        else {
            changes = object;
        }
        return changes;
    };
    DiffProcessor.prototype.getDifferences = function (object, reference) {
        var differences = immutable_1.Map();
        reference.forEach(function (value, key) {
            if (object.hasOwnProperty(key) && (value instanceof immutable_1.Map || value instanceof immutable_1.List || value !== object[key])) {
                differences = differences.set(key, object[key]);
            }
        });
        return differences.size > 0 ? differences.toJS() : null;
    };
    return DiffProcessor;
}());
var processor = new DiffProcessor();
exports.processor = processor;
