"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var Promise = require("bluebird");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var service_repository_1 = require("../repository/service-repository");
var abstract_route_1 = require("./abstract-route");
var model_1 = require("../model");
var ServicesRoute = (function (_super) {
    __extends(ServicesRoute, _super);
    function ServicesRoute(modelDescriptorService, eventDispatcherService, serviceRepository) {
        var _this = _super.call(this, eventDispatcherService) || this;
        _this.modelDescriptorService = modelDescriptorService;
        _this.serviceRepository = serviceRepository;
        return _this;
    }
    ServicesRoute.getInstance = function () {
        if (!ServicesRoute.instance) {
            ServicesRoute.instance = new ServicesRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), service_repository_1.ServiceRepository.getInstance());
        }
        return ServicesRoute.instance;
    };
    ServicesRoute.prototype.getCategory = function (categoryId, stack) {
        var self = this, objectType = model_1.Model.ServicesCategory, columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/services-category/_/' + encodeURIComponent(categoryId)
        };
        return Promise.all([
            this.serviceRepository.listServicesCategories(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (categories, uiDescriptor) {
            context.object = _.find(categories, { id: categoryId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    ServicesRoute.prototype.getService = function (serviceId, stack) {
        var self = this, objectType = model_1.Model.Service, columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/service/_/' + encodeURIComponent(serviceId)
        };
        return Promise.all([
            this.serviceRepository.listServices(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (services, uiDescriptor) {
            context.object = _.find(services, { id: serviceId });
            context.userInterfaceDescriptor = uiDescriptor;
            return Promise.resolve(context.object.config);
        }).then(function () {
            return self.updateStackWithContext(stack, context);
        });
    };
    ServicesRoute.prototype.listRsyncdModules = function (stack) {
        var self = this, objectType = model_1.Model.RsyncdModule, columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/modules'
        };
        return Promise.all([
            this.serviceRepository.listRsyncdModules(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (rsyncdModules, uiDescriptor) {
            context.object = rsyncdModules;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    ServicesRoute.prototype.createRsyncdModule = function (stack) {
        var self = this, objectType = model_1.Model.RsyncdModule, columnIndex = 4, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.serviceRepository.getNewRsyncdModule(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (rsyncdModule, uiDescriptor) {
            context.object = rsyncdModule;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    ServicesRoute.prototype.getRsyncdModule = function (rsyncdModuleId, stack) {
        var self = this, objectType = model_1.Model.RsyncdModule, columnIndex = 4, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/modules/rsyncd-module/_/' + encodeURIComponent(rsyncdModuleId)
        };
        return Promise.all([
            this.serviceRepository.listRsyncdModules(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (rsyncdModules, uiDescriptor) {
            context.object = _.find(rsyncdModules, { id: rsyncdModuleId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    return ServicesRoute;
}(abstract_route_1.AbstractRoute));
exports.ServicesRoute = ServicesRoute;
