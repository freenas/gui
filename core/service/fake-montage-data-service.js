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
        return this.middlewareClient.connect().then(function () {
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
    };
    FakeMontageDataService.prototype.saveDataObject = function (object, args) {
        return this.modelDescriptorService.getDaoForObject(object).then(function (dao) {
            return dao.save(object, args);
        });
    };
    FakeMontageDataService.prototype.deleteDataObject = function (object, args) {
        return this.modelDescriptorService.getDaoForObject(object).then(function (dao) {
            return dao.delete(object, args);
        });
    };
    FakeMontageDataService.prototype.getNewInstanceForType = function (type) {
        return this.modelDescriptorService.getDaoForType(type.typeName).then(function (dao) {
            return dao.getNewInstance();
        });
    };
    return FakeMontageDataService;
}());
exports.FakeMontageDataService = FakeMontageDataService;
