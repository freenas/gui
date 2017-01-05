"use strict";
var middleware_client_1 = require("./middleware-client");
var datastore_service_1 = require("./datastore-service");
var model_descriptor_service_1 = require("./model-descriptor-service");
// DTM
var FakeMontageDataService = (function () {
    function FakeMontageDataService() {
        this.middlewareClient = middleware_client_1.MiddlewareClient.getInstance();
        this.datastoreService = datastore_service_1.DatastoreService.getInstance();
        this.modelDescriptorService = model_descriptor_service_1.ModelDescriptorService.getInstance();
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
        return this.modelDescriptorService.getDaoForType(type.typeName).then(function (dao) {
            return criteria ?
                isSingle ?
                    dao.findSingleEntry(criteria) :
                    dao.find(criteria) :
                dao.list();
        });
        /*
                let key = type.typeName,
                    entries;
                if (this.cacheService.hasCacheKey(key) && (entries = this.cacheService.getCacheEntry(key)).length > 0) {
                    return Promise.resolve(entries);
                } else {
                    return this.queryObjectsFromMiddleware(type, criteria, isSingle);
                }
        */
    };
    FakeMontageDataService.prototype.saveDataObject = function (object, args) {
        return this.modelDescriptorService.getDaoForObject(object).then(function (dao) {
            return dao.save(object, args);
        });
        /*
                this.loadPropertyDescriptors(object);
                return object._isNew ? this.create(object, args) : this.update(object, args);
        */
    };
    FakeMontageDataService.prototype.deleteDataObject = function (object, args) {
        return this.modelDescriptorService.getDaoForObject(object).then(function (dao) {
            return dao.delete(object, args);
        });
        /*
                let typeName = object._objectType ||
                    (object.Type && object.Type.typeName) ||
                    (object.constructor.Type && object.constructor.Type.typeName);
                return this.middlewareClient.submitTask(ChangeCase.dotCase(typeName) + '.delete', [object.id]);
        */
    };
    FakeMontageDataService.prototype.getNewInstanceForType = function (type) {
        return this.modelDescriptorService.getDaoForType(type.typeName).then(function (dao) {
            return dao.getNewInstance();
        });
        /*
                let self = this;
                return this.cacheService.registerTypeForKey(type, type.typeName).then(function () {
                    let instance = self.cacheService.getDataObject(type.typeName);
                    instance._isNew = true;
                    return instance;
                });
        */
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
        return result;
    };
    return FakeMontageDataService;
}());
exports.FakeMontageDataService = FakeMontageDataService;
