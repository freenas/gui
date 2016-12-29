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
var ServicesRoute = (function (_super) {
    __extends(ServicesRoute, _super);
    function ServicesRoute(modelDescriptorService, eventDispatcherService, serviceRepository) {
        _super.call(this, eventDispatcherService);
        this.modelDescriptorService = modelDescriptorService;
        this.serviceRepository = serviceRepository;
    }
    ServicesRoute.getInstance = function () {
        if (!ServicesRoute.instance) {
            ServicesRoute.instance = new ServicesRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), service_repository_1.ServiceRepository.getInstance());
        }
        return ServicesRoute.instance;
    };
    ServicesRoute.prototype.getCategory = function (categoryId, stack) {
        var self = this, objectType = 'ServicesCategory', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/services-category/_/' + categoryId
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
        var self = this, objectType = 'Service', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/services-category/_/' + serviceId
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
    return ServicesRoute;
}(abstract_route_1.AbstractRoute));
exports.ServicesRoute = ServicesRoute;
