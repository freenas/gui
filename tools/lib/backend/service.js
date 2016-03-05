var Connect = require('./connect');
var Promise = require('montage/core/promise').Promise;

require('../../../core/extras/string');
require('montage/core/extras/string');

var CACHE = {
    SCHEMAS: null,
    MODELS: null
};

var findSchemas = exports.findSchemas = function findSchemas (options) {
    if (CACHE.SCHEMAS) {
        return Promise.resolve(CACHE.SCHEMAS)
    }

    return Connect.authenticateIfNeeded(options.username, options.password, options).then(function (websocket) {
        return websocket.send("rpc", "call", {
            method: "discovery.get_schema",
            args: []

        }).then(function (response) {


            return (CACHE.SCHEMAS = response.args.definitions);
        });
    });
};


exports.findMethodsForServices = function findMethodsForServices (options) {
    return Connect.authenticateIfNeeded(options.username, options.password, options).then(function (websocket) {
        return websocket.send("rpc", "call", {
            method: "discovery.get_services",
            args: []

        }).then(function (response) {
            var services = response.args;

            return Promise.map(services, function (service) {
                return websocket.send("rpc", "call", {
                    method: "discovery.get_methods",
                    args: [service]

                }).then(function (response) {
                    response.args._meta_data = {
                        service_name: service,
                        service_name_camel_case: service.toCamelCase()
                    };

                    return response.args;
                });
            });
        });
    });
};

exports.findTaskDescriptors = function findTaskDescriptors (options) {
    return Connect.authenticateIfNeeded(options.username, options.password, options).then(function (websocket) {
        return websocket.send("rpc", "call", {
            method: "discovery.get_tasks",
            args: []

        }).then(function (response) {
            var tasksForServices = response.args,
                tasksForServicesKeys = Object.keys(tasksForServices),
                promises = [],
                tasksForServicesKey;

            for (var i = 0, length = tasksForServicesKeys.length; i < length; i++) {
                tasksForServicesKey = tasksForServicesKeys[i];

                promises.push(
                    _findTaskDescriptorForTaskName(options, tasksForServicesKey, tasksForServices[tasksForServicesKey].schema)
                );
            }

            return Promise.all(promises).then(function (taskDescriptors) {
                return taskDescriptors.filter(function (taskDescriptor) {
                    return !!taskDescriptor;
                });
            });
        });
    });
};


var _findModels = function _findModels (options) {
    if (CACHE.MODELS) {
        return Promise.resolve(CACHE.MODELS)
    }

    return findSchemas(options).then(function (schemas) {
        var schemaKeys = Object.keys(schemas),
            models = [],
            schemaKey;

        for (var i = 0, length = schemaKeys.length; i < length; i++) {
            schemaKey = schemaKeys[i];

            models.push(schemaKey.toCamelCase());
        }

        return (CACHE.MODELS = models);
    });
};

var _findTaskDescriptorForTaskName = function _findTaskDescriptorForTaskName (options, taskName, schema) {
    var promise;

    if (CACHE.MODELS) {
        promise = Promise.resolve(CACHE.MODELS)
    } else {
        promise = _findModels(options);
    }

    return promise.then(function (models) {
        var part = taskName.split(/\.|_|-|\s/),
            modelCandidate = part.slice(0, part.length -1).join('.').toCamelCase(),
            model;

        if (models.indexOf(modelCandidate) > -1) { // case -> model name + task
            model = {
                name: modelCandidate,
                taskType: part[part.length -1],
                task: taskName,
                schema: schema
            };
        }

        return model;
    });
};


exports.findEventTypesForEntities = function findEventTypesForEntities (options) {
    return Connect.authenticateIfNeeded(options.username, options.password, options).then(function (websocket) {
        return websocket.send("rpc", "call", {
            method: "discovery.get_event_types",
            args: []

        }).then(function (response) {
            var eventTypeKeys = Object.keys(response.args),
                eventTypes = {},
                eventTypeKey,
                match;

            for (var i = 0, length = eventTypeKeys.length; i < length; i++) {
                eventTypeKey = eventTypeKeys[i];

                if (eventTypeKey) {
                    match = eventTypeKey.match(/^entity-subscriber\.([a-z\.-]+)\.changed$/i);

                    if (match && match.length === 2) {
                        eventTypes[match[1].toCamelCase()] = eventTypeKey;
                    }
                }
            }

            return eventTypes;
        });
    });
};
