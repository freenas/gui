"use strict";
var immutable = require("immutable");
var datastore_service_1 = require("../datastore-service");
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
        var self = this, differences = new Map();
        reference.forEach(function (value, key) {
            if (object.hasOwnProperty(key)) {
                if (value instanceof immutable.Map) {
                    var childDifferences = self.getDifferences(object[key], value);
                    if (childDifferences) {
                        differences = differences.set(key, childDifferences);
                    }
                }
                else if (value instanceof immutable.List || object[key] !== value) {
                    differences = differences.set(key, object[key]);
                }
            }
        });
        return differences.size > 0 ? immutable.Map(differences).toJS() : null;
    };
    return DiffProcessor;
}());
var processor = new DiffProcessor();
exports.processor = processor;
