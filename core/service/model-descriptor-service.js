"use strict";
var middleware_client_1 = require("core/service/middleware-client");
var ChangeCase = require("change-case");
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
        return this.uiCache.has(type) ?
            Promise.resolve(this.uiCache.get(type)) :
            SystemJS.import(this.UI_DESCRIPTOR_PREFIX + ChangeCase.paramCase(type) + this.UI_DESCRIPTOR_SUFFIX)
                .then(function (uiDescriptor) {
                self.uiCache.set(type, uiDescriptor.root.properties);
                return uiDescriptor.root.properties;
            });
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
                var Dao = daoModule[type + 'Dao'], dao = Dao.getInstance ? Dao.getInstance() : Dao.instance;
                self.daoCache.set(type, dao);
                return dao;
            });
    };
    ModelDescriptorService.prototype.getObjectType = function (object) {
        var type = object._objectType || (Array.isArray(object) && object.length > 0 && object[0]._objectType);
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
    return ModelDescriptorService;
}());
exports.ModelDescriptorService = ModelDescriptorService;
