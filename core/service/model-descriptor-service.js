"use strict";
var middleware_client_1 = require("./middleware-client");
var ChangeCase = require("change-case");
var Promise = require("bluebird");
var ModelDescriptorService = (function () {
    function ModelDescriptorService(middlewareClient) {
        this.middlewareClient = middlewareClient;
        this.UI_DESCRIPTOR_PREFIX = 'core/model/user-interface-descriptors/';
        this.UI_DESCRIPTOR_SUFFIX = '-user-interface-descriptor.mjson';
        this.DAO_PREFIX = 'core/dao/';
        this.DAO_SUFFIX = '-dao.js';
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
        var self = this;
        if (type) {
            return this.uiCache.has(type) ?
                Promise.resolve(this.uiCache.get(type)) :
                Promise.resolve(SystemJS.import(this.UI_DESCRIPTOR_PREFIX + ChangeCase.paramCase(type) + this.UI_DESCRIPTOR_SUFFIX)
                    .then(function (uiDescriptor) {
                    self.uiCache.set(type, uiDescriptor.root.properties);
                    return uiDescriptor.root.properties;
                }));
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
        var self = this;
        return this.daoCache.has(type) ?
            Promise.resolve(this.daoCache.get(type)) :
            require.async(this.DAO_PREFIX + ChangeCase.paramCase(type) + this.DAO_SUFFIX).then(function (daoModule) {
                var dao = new (daoModule[type + 'Dao'])();
                self.daoCache.set(type, dao);
                return dao;
            }, function () {
                debugger;
            });
    };
    ModelDescriptorService.prototype.getObjectType = function (object) {
        var type = (Array.isArray(object._objectType) && object._objectType[0]) || object._objectType || (Array.isArray(object) && object.length > 0 && object[0]._objectType);
        if (!type) {
            var model = object.Type ||
                object.constructor.Type ||
                Array.isArray(object) && object._meta_data && object._meta_data.collectionModelType;
            if (model) {
                type = model.typeName;
            }
        }
        return type;
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
                        result = ChangeCase.pascalCase(propertyDescriptor['$ref']);
                    }
                }
            }
            return result;
        });
    };
    ModelDescriptorService.prototype.loadRemoteSchema = function () {
        var self = this;
        return this.schema ?
            Promise.resolve(this.schema) :
            this.middlewareClient.callRpcMethod('discovery.get_schema').then(function (schema) {
                self.schema = new Map();
                for (var schemaType in schema.definitions) {
                    var objectType = ChangeCase.pascalCase(schemaType);
                    self.schema.set(objectType, schema.definitions[schemaType]);
                }
                return self.schema;
            });
    };
    return ModelDescriptorService;
}());
exports.ModelDescriptorService = ModelDescriptorService;
