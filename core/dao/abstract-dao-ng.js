"use strict";
var middleware_client_1 = require("core/service/middleware-client");
var datastore_service_1 = require("core/service/datastore-service");
var model_1 = require("core/model/model");
var cleaner_1 = require("core/service/data-processor/cleaner");
var diff_1 = require("core/service/data-processor/diff");
var null_1 = require("core/service/data-processor/null");
var change_case_1 = require("change-case");
var _ = require("lodash");
// DTM
var cache_service_1 = require("core/service/cache-service");
var AbstractDao = (function () {
    function AbstractDao(model, config) {
        config = config || {};
        var self = this;
        this.model = model;
        this.objectType = config.typeName || model.typeName;
        this.middlewareName = config.middlewareName || change_case_1.paramCase(this.objectType);
        this.queryMethod = config.queryMethod || change_case_1.dotCase(this.objectType) + '.query';
        this.updateMethod = config.updateMethod || change_case_1.dotCase(this.objectType) + '.update';
        this.createMethod = config.createMethod || change_case_1.dotCase(this.objectType) + '.create';
        this.deleteMethod = config.deleteMethod || change_case_1.dotCase(this.objectType) + '.delete';
        this.eventName = config.eventName || 'entity-subscriber.' + this.middlewareName + '.changed';
        this.middlewareClient = middleware_client_1.MiddlewareClient.getInstance();
        this.datastoreService = datastore_service_1.DatastoreService.getInstance();
        // DTM
        this.cacheService = cache_service_1.CacheService.getInstance();
        this.registerPromise = this.cacheService.registerTypeForKey(model, model.typeName).then(function () {
            self.propertyDescriptors = new Map();
            if (model.constructor.propertyBlueprints) {
                for (var _i = 0, _a = model.constructor.propertyBlueprints; _i < _a.length; _i++) {
                    var descriptor = _a[_i];
                    self.propertyDescriptors.set(descriptor.name, descriptor);
                }
            }
        });
    }
    AbstractDao.prototype.list = function () {
        return this.query();
    };
    AbstractDao.prototype.get = function () {
        return this.list().then(function (x) { return x[0]; });
    };
    AbstractDao.prototype.findSingleEntry = function (criteria) {
        return this.query(criteria, true).then(function (results) {
            return results[0];
        });
    };
    AbstractDao.prototype.save = function (object, args) {
        return object._isNew ? this.create(object, args) : this.update(object, args);
    };
    AbstractDao.prototype.delete = function (object, args) {
        args = args || [];
        return this.middlewareClient.submitTask(this.deleteMethod, _.concat([object.id], args));
    };
    AbstractDao.prototype.getNewInstance = function () {
        var self = this;
        return this.cacheService.registerTypeForKey(this.objectType, this.model).then(function () {
            var newInstance = new Object({
                _isNew: true,
                _objectType: self.objectType
            });
            return newInstance;
        });
    };
    AbstractDao.prototype.getEmptyList = function () {
        var self = this;
        return this.cacheService.registerTypeForKey(this.objectType, this.model).then(function () {
            var emptyList = [];
            emptyList._objectType = self.objectType;
            return emptyList;
        });
    };
    AbstractDao.prototype.update = function (object, args) {
        args = args || [];
        return this.middlewareClient.submitTask(this.updateMethod, _.concat([object.id,
            diff_1.processor.process(cleaner_1.processor.process(object, this.propertyDescriptors), this.objectType, object.id)
        ], args));
    };
    AbstractDao.prototype.create = function (object, args) {
        args = args || [];
        return this.middlewareClient.submitTask(this.createMethod, _.concat([
            null_1.processor.process(cleaner_1.processor.process(object, this.propertyDescriptors))
        ], args));
    };
    AbstractDao.prototype.query = function (criteria, isSingle) {
        var self = this, middlewareCriteria = criteria ? this.getMiddlewareCriteria(criteria, isSingle) : [];
        var modelInitializationPromise = this.model.typeName ? model_1.Model.populateObjectPrototypeForType(this.model) : Promise.resolve();
        return modelInitializationPromise.then(function () {
            return self.datastoreService.query(self.objectType, self.queryMethod, middlewareCriteria);
        }).then(function (entries) {
            entries = Array.isArray(entries) ? entries : [entries];
            self.middlewareClient.subscribeToEvents(self.eventName);
            var results = entries.map(function (x) {
                x._objectType = self.objectType;
                x.Type = x.constructor.Type = self.model;
                return x;
            });
            results._meta_data = {
                collectionModelType: self.model
            };
            results._objectType = self.objectType;
            return results;
        });
    };
    AbstractDao.prototype.getMiddlewareCriteria = function (criteria, isSingle, limit) {
        var keys = Object.keys(criteria), middlewareCriteria = [], result, key, value;
        for (var i = 0, length_1 = keys.length; i < length_1; i++) {
            key = keys[i];
            value = criteria[key];
            if (typeof value === 'object') {
                var subCriteria = this._getMiddlewareCriteriaFromObject(value);
                Array.prototype.push.apply(middlewareCriteria, subCriteria.map(function (x) { return [key + '.' + x[0], x[1], x[2]]; }));
            }
            else {
                middlewareCriteria.push([key, '=', value]);
            }
        }
        if (isSingle || (limit && limit !== -1)) {
            var params = {};
            if (isSingle) {
                params.single = true;
            }
            if (limit && limit !== -1) {
                params.limit = limit;
            }
            result = [middlewareCriteria, params];
        }
        else {
            result = [middlewareCriteria];
        }
        return result;
    };
    return AbstractDao;
}());
AbstractDao.Model = model_1.Model;
exports.AbstractDao = AbstractDao;
