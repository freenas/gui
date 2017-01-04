"use strict";
var middleware_client_1 = require("../service/middleware-client");
var datastore_service_1 = require("../service/datastore-service");
var methodCleaner_1 = require("../service/data-processor/methodCleaner");
var cleaner_1 = require("../service/data-processor/cleaner");
var diff_1 = require("../service/data-processor/diff");
var null_1 = require("../service/data-processor/null");
var _ = require("lodash");
var Promise = require("bluebird");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var AbstractDao = (function () {
    function AbstractDao(objectType, config) {
        this.isRegistered = false;
        config = config || {};
        this.objectType = config.typeName || objectType;
        this.middlewareName = config.middlewareName || _.kebabCase(objectType);
        this.queryMethod = config.queryMethod || AbstractDao.dotCase(objectType) + '.query';
        this.updateMethod = config.updateMethod || AbstractDao.dotCase(objectType) + '.update';
        this.createMethod = config.createMethod || AbstractDao.dotCase(objectType) + '.create';
        this.deleteMethod = config.deleteMethod || AbstractDao.dotCase(objectType) + '.delete';
        this.eventName = config.eventName || 'entity-subscriber.' + this.middlewareName + '.changed';
        this.preventQueryCaching = config.preventQueryCaching;
        this.middlewareClient = middleware_client_1.MiddlewareClient.getInstance();
        this.datastoreService = datastore_service_1.DatastoreService.getInstance();
        this.modelDescriptorService = model_descriptor_service_1.ModelDescriptorService.getInstance();
        this.taskDescriptorsPromise = new Map();
    }
    AbstractDao.prototype.list = function () {
        return (this.listPromise && !this.preventQueryCaching) ?
            this.listPromise :
            this.listPromise = this.query();
    };
    AbstractDao.prototype.get = function () {
        return this.list().then(function (x) { return x[0]; });
    };
    AbstractDao.prototype.findSingleEntry = function (criteria, params) {
        params = params || {};
        params.single = true;
        return this.query(criteria, params).then(function (results) {
            return results[0];
        });
    };
    AbstractDao.prototype.find = function (criteria, params) {
        criteria = criteria || {};
        params = params || {};
        return this.query(criteria, params).then(function (results) {
            return results;
        });
    };
    AbstractDao.prototype.register = function () {
        if (!this.isRegistered) {
            this.middlewareClient.subscribeToEvents(this.eventName);
            this.isRegistered = true;
        }
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
        return Promise.resolve(new Object({
            _isNew: true,
            _objectType: self.objectType
        }));
    };
    AbstractDao.prototype.getEmptyList = function () {
        var self = this;
        var emptyList = [];
        emptyList._objectType = self.objectType;
        return Promise.resolve(emptyList);
    };
    AbstractDao.prototype.update = function (object, args) {
        var _this = this;
        args = args || [];
        return Promise.all([
            this.loadPropertyDescriptors(),
            this.loadTaskDescriptor(this.updateMethod)
        ]).spread(function (propertyDescriptors, methodDescriptor) {
            var update = methodCleaner_1.processor.process(diff_1.processor.process(cleaner_1.processor.process(object, propertyDescriptors), _this.objectType, object.id, propertyDescriptors), methodDescriptor);
            if (update || (args && args.length > 0)) {
                var payload = _.concat(object.id ? [object.id, update] : [update], args);
                return _this.middlewareClient.submitTask(_this.updateMethod, payload);
            }
        });
    };
    AbstractDao.prototype.create = function (object, args) {
        var _this = this;
        args = args || [];
        return Promise.all([
            this.loadPropertyDescriptors(),
            this.loadTaskDescriptor(this.createMethod)
        ]).spread(function (propertyDescriptors, methodDescriptor) {
            var newObject = methodCleaner_1.processor.process(null_1.processor.process(cleaner_1.processor.process(object, propertyDescriptors)), methodDescriptor);
            if (newObject) {
                return _this.middlewareClient.submitTask(_this.createMethod, _.concat([newObject], args));
            }
        });
    };
    AbstractDao.prototype.query = function (criteria, isSingle) {
        var self = this, middlewareCriteria = criteria ? this.getMiddlewareCriteria(criteria, isSingle) : [];
        return this.datastoreService.query(self.objectType, self.queryMethod, middlewareCriteria).then(function (entries) {
            entries = Array.isArray(entries) ? entries : [entries];
            self.register();
            var results = entries.map(function (x) {
                x._objectType = self.objectType;
                return x;
            });
            results._objectType = self.objectType;
            return results;
        });
    };
    AbstractDao.prototype.getMiddlewareCriteria = function (criteria, params) {
        var keys = Object.keys(criteria), middlewareCriteria = [], key, value;
        for (var i = 0, length_1 = keys.length; i < length_1; i++) {
            key = keys[i];
            value = criteria[key];
            if (typeof value === 'object') {
                var subCriteria = this.getMiddlewareCriteria(value);
                Array.prototype.push.apply(middlewareCriteria, subCriteria.map(function (x) { return [key + '.' + x[0], x[1], x[2]]; }));
            }
            else {
                middlewareCriteria.push([key, '=', value]);
            }
        }
        return params ? [middlewareCriteria, params] : [middlewareCriteria];
    };
    AbstractDao.dotCase = function (aString) {
        return _.replace(_.snakeCase(aString), '_', '.');
    };
    AbstractDao.prototype.loadTaskDescriptor = function (method) {
        if (!this.taskDescriptorsPromise.has(method)) {
            this.taskDescriptorsPromise.set(method, this.modelDescriptorService.getTaskDescriptor(method));
        }
        return this.taskDescriptorsPromise.get(method);
    };
    AbstractDao.prototype.loadPropertyDescriptors = function () {
        if (!this.propertyDescriptorsPromise) {
            this.propertyDescriptorsPromise = this.modelDescriptorService.getPropertyDescriptorsForType(this.objectType);
        }
        return this.propertyDescriptorsPromise;
    };
    return AbstractDao;
}());
exports.AbstractDao = AbstractDao;
