"use strict";
var middleware_client_1 = require("./middleware-client");
var Promise = require("bluebird");
var _ = require("lodash");
var ModelDescriptorService = (function () {
    function ModelDescriptorService(middlewareClient) {
        this.middlewareClient = middlewareClient;
        this.UI_DESCRIPTOR_PREFIX = 'core/model/user-interface-descriptors/';
        this.UI_DESCRIPTOR_SUFFIX = '-user-interface-descriptor.mjson';
        this.DAO_PREFIX = 'core/dao/';
        this.DAO_SUFFIX = '-dao';
        this.uiCache = new Map();
        this.daoCache = new Map();
    }
    ModelDescriptorService.getInstance = function () {
        if (!ModelDescriptorService.instance) {
            ModelDescriptorService.instance = new ModelDescriptorService(middleware_client_1.MiddlewareClient.getInstance());
        }
        return ModelDescriptorService.instance;
    };
    ModelDescriptorService.prototype.getUiDescriptorForObject = function (object) {
        var type = this.getObjectType(object), result;
        if (type) {
            result = this.getUiDescriptorForType(type);
        }
        return result;
    };
    ModelDescriptorService.prototype.getUiDescriptorForType = function (type) {
        if (typeof type !== 'string')
            debugger;
        var self = this;
        if (type) {
            var uiDescriptorPath = this.UI_DESCRIPTOR_PREFIX + _.kebabCase(type) + this.UI_DESCRIPTOR_SUFFIX;
            return Promise.resolve(this.uiCache.has(type) ?
                this.uiCache.get(type) :
                SystemJS.import(uiDescriptorPath).then(function (uiDescriptor) {
                    self.uiCache.set(type, uiDescriptor.root.properties);
                    return uiDescriptor.root.properties;
                }, function () { debugger; }));
        }
    };
    ModelDescriptorService.prototype.getDaoForObject = function (object) {
        var type = this.getObjectType(object), result;
        if (type) {
            result = this.getDaoForType(type);
        }
        return result;
    };
    ModelDescriptorService.prototype.getDaoForType = function (type) {
        var daoPath = this.DAO_PREFIX + _.kebabCase(type) + this.DAO_SUFFIX;
        if (!this.daoCache.has(type)) {
            this.daoCache.set(type, Promise.resolve(require.async(daoPath).then(function (daoModule) { return new (daoModule[type + 'Dao'])(); }, function () { debugger; })));
        }
        return this.daoCache.get(type);
    };
    ModelDescriptorService.prototype.getObjectType = function (object) {
        return (Array.isArray(object._objectType) && object._objectType[0]) ||
            object._objectType ||
            (Array.isArray(object) && object.length > 0 && object[0]._objectType);
    };
    ModelDescriptorService.prototype.getPropertyType = function (type, property) {
        return this.loadRemoteSchema().then(function (schema) {
            var result;
            if (schema.has(type)) {
                var propertyDescriptor = schema.get(type).properties[property];
                if (propertyDescriptor) {
                    if (propertyDescriptor.type) {
                        result = propertyDescriptor.type;
                    }
                    else if (propertyDescriptor['$ref']) {
                        result = _.upperFirst(_.camelCase(propertyDescriptor['$ref']));
                    }
                }
            }
            return result;
        });
    };
    ModelDescriptorService.prototype.getTaskDescriptor = function (taskPath) {
        return this.loadTasksDescriptors().then(function (descriptors) { return descriptors.has(taskPath) ? descriptors.get(taskPath) : null; });
    };
    ModelDescriptorService.prototype.getPropertyDescriptorsForType = function (type) {
        return this.loadRemoteSchema().then(function (schema) { return schema.has(type) ? schema.get(type).properties : null; });
    };
    ModelDescriptorService.prototype.loadTasksDescriptors = function () {
        var _this = this;
        return this.taskSchemaCache ?
            Promise.resolve(this.taskSchemaCache) :
            this.taskSchemaPromise ?
                this.taskSchemaPromise :
                this.taskSchemaPromise = this.middlewareClient.callRpcMethod('discovery.get_tasks').then(function (tasks) {
                    _this.taskSchemaCache = new Map();
                    _.forEach(tasks, function (task, taskName) {
                        _this.taskSchemaCache.set(taskName, new Map()
                            .set('description', task.description)
                            .set('abortable', task.abortable)
                            .set('mandatory', _this.getMandatoryProperties(task.schema))
                            .set('forbidden', _this.getForbiddenProperties(task.schema)));
                    });
                    return _this.taskSchemaCache;
                });
    };
    ModelDescriptorService.prototype.getMandatoryProperties = function (schema) {
        var object = _.get(_.find(schema, function (arg) { return _.has(arg, 'allOf'); }), 'allOf', []);
        return _.get(_.find(object, function (restriction) { return _.has(restriction, 'required'); }), 'required', []);
    };
    ModelDescriptorService.prototype.getForbiddenProperties = function (schema) {
        var object = _.get(_.find(schema, function (arg) { return _.has(arg, 'allOf'); }), 'allOf', []);
        return _.get(_.find(object, function (restriction) { return _.has(restriction, 'not.required'); }), 'not.required', []);
    };
    ModelDescriptorService.prototype.loadRemoteSchema = function () {
        var self = this;
        return this.schema ?
            Promise.resolve(this.schema) :
            this.middlewareClient.callRpcMethod('discovery.get_schema').then(function (schema) {
                self.schema = new Map();
                _.forIn(schema.definitions, function (definition, type) {
                    self.schema.set(_.upperFirst(_.camelCase(type)), definition);
                });
                return self.schema;
            });
    };
    return ModelDescriptorService;
}());
exports.ModelDescriptorService = ModelDescriptorService;
