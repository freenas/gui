"use strict";
var middleware_client_1 = require("./middleware-client");
var datastore_service_1 = require("./datastore-service");
var cache_service_1 = require("./cache-service");
var cleaner_1 = require("core/service/data-processor/cleaner");
var diff_1 = require("core/service/data-processor/diff");
var null_1 = require("core/service/data-processor/null");
var model_1 = require("core/model/model");
var ChangeCase = require("change-case");
// DTM
var FakeMontageDataService = (function () {
    function FakeMontageDataService() {
        this.middlewareClient = middleware_client_1.MiddlewareClient.getInstance();
        this.datastoreService = datastore_service_1.DatastoreService.getInstance();
        this.cacheService = cache_service_1.CacheService.getInstance();
        this.validPropertyRegex = /[a-z0-9_]*/;
        this.typePropertiesDescriptors = new Map();
    }
    FakeMontageDataService.getInstance = function () {
        if (!FakeMontageDataService.instance) {
            FakeMontageDataService.instance = new FakeMontageDataService();
        }
        return FakeMontageDataService.instance;
    };
    FakeMontageDataService.prototype.loginWithCredentials = function (login, password) {
        var self = this;
        return this.middlewareClient.connect(this.getURL()).then(function () {
            return self.middlewareClient.login(login, password);
        });
    };
    FakeMontageDataService.prototype.fetchData = function (type, criteria, isSingle) {
        var key = type.typeName, entries;
        if (this.cacheService.hasCacheKey(key) && (entries = this.cacheService.getCacheEntry(key)).length > 0) {
            return Promise.resolve(entries);
        }
        else {
            return this.queryObjectsFromMiddleware(type, criteria, isSingle);
        }
    };
    FakeMontageDataService.prototype.saveDataObject = function (object, args) {
        this.loadPropertyDescriptors(object);
        return object._isNew ? this.create(object, args) : this.update(object, args);
    };
    FakeMontageDataService.prototype.deleteDataObject = function (object, args) {
        var typeName = object._objectType ||
            (object.Type && object.Type.typeName) ||
            (object.constructor.Type && object.constructor.Type.typeName);
        return this.middlewareClient.submitTask(ChangeCase.dotCase(typeName) + '.delete', [object.id]);
    };
    FakeMontageDataService.prototype.getNewInstanceForType = function (type) {
        var self = this;
        return this.cacheService.registerTypeForKey(type, type.typeName).then(function () {
            var instance = self.cacheService.getDataObject(type.typeName);
            instance._isNew = true;
            return instance;
        });
    };
    FakeMontageDataService.prototype.getEmptyCollectionForType = function (type) {
        return this.cacheService.registerTypeForKey(type, type.typeName).then(function () {
            var emptyArray = [];
            emptyArray._meta_data = {
                collectionModelType: type
            };
            return emptyArray;
        });
    };
    FakeMontageDataService.prototype.subscribeToEvents = function (name, type) {
        return Promise.all([
            this.cacheService.registerTypeForKey(type, type.typeName),
            this.middlewareClient.subscribeToEvents(name)
        ]);
    };
    FakeMontageDataService.prototype.loadPropertyDescriptors = function (object) {
        if (object.constructor.Type && object.constructor.Type.constructor) {
            var propertyDescriptors = new Map();
            for (var _i = 0, _a = object.constructor.Type.constructor.propertyBlueprints; _i < _a.length; _i++) {
                var descriptor = _a[_i];
                propertyDescriptors.set(descriptor.name, descriptor);
            }
            this.typePropertiesDescriptors.set(object.constructor.Type.typeName, propertyDescriptors);
        }
    };
    FakeMontageDataService.prototype.update = function (object, args) {
        var type = object.constructor.Type, typeName = type.typeName, methodName = type.updateMethod || ChangeCase.dotCase(typeName) + '.update';
        return this.middlewareClient.submitTask(methodName, [object.id,
            diff_1.processor.process(cleaner_1.processor.process(object, this.typePropertiesDescriptors.get(object.constructor.Type.typeName)), typeName, object.id)
        ]);
    };
    FakeMontageDataService.prototype.create = function (object, args) {
        var type = object.constructor.Type, typeName = type.typeName, methodName = type.createMethod || ChangeCase.dotCase(typeName) + '.create';
        return this.middlewareClient.submitTask(methodName, [
            null_1.processor.process(cleaner_1.processor.process(object, this.typePropertiesDescriptors.get(object.constructor.Type.typeName)))
        ]);
    };
    FakeMontageDataService.prototype.queryObjectsFromMiddleware = function (type, criteria, isSingle) {
        var self = this, typeName = type.typeName, middlewareType = type.middlewareType || ChangeCase.paramCase(typeName), methodName = type.queryMethod || ChangeCase.dotCase(typeName) + '.query', limit = type === model_1.Model.Task ? 100 : -1, middlewareCriteria = (criteria || limit !== -1) ? this.getMiddlewareCriteria(criteria, isSingle, limit) : [];
        return model_1.Model.populateObjectPrototypeForType(type).then(function () {
            return self.cacheService.registerTypeForKey(type, typeName);
        }).then(function () {
            return self.middlewareClient.callRpcMethod(methodName, middlewareCriteria);
        }).then(function (entries) {
            entries = Array.isArray(entries) ? entries : [entries];
            var cache = self.cacheService.initializeCacheKey(typeName);
            self.datastoreService.import(typeName, entries);
            self.middlewareClient.subscribeToEvents('entity-subscriber.' + middlewareType + '.changed');
            return cache;
        });
    };
    FakeMontageDataService.prototype.getMiddlewareCriteria = function (criteria, isSingle, limit) {
        criteria = criteria || {};
        var keys = Object.keys(criteria), middlewareCriteria = [], result, key, value;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            value = criteria[key];
            if (typeof value === 'object') {
                var subCriteria = this._getMiddlewareCriteriaFromObject(value);
                Array.prototype.push.apply(middlewareCriteria, subCriteria.map(function (x) {
                    return [key + '.' + x[0], x[1], x[2]];
                }));
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
    FakeMontageDataService.prototype.getURL = function () {
        var scheme = location.protocol === 'https:' ? 'wss' : 'ws', host = this.getHost();
        return scheme + "://" + host + "/dispatcher/socket";
    };
    FakeMontageDataService.prototype.getHost = function () {
        var result = location.host, hostParam = location.href.split(';').filter(function (x) { return x.split('=')[0] === 'host'; })[0];
        if (hostParam) {
            var host = hostParam.split('=')[1];
            if (host && host.length > 0) {
                result = host;
            }
        }
        return host;
    };
    return FakeMontageDataService;
}());
exports.FakeMontageDataService = FakeMontageDataService;
