"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var model_event_name_1 = require("../model-event-name");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var service_repository_1 = require("../repository/service-repository");
var ServicesRoute = (function () {
    function ServicesRoute(modelDescriptorService, eventDispatcherService, serviceRepository) {
        this.modelDescriptorService = modelDescriptorService;
        this.eventDispatcherService = eventDispatcherService;
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
            while (stack.length > columnIndex) {
                var context_1 = stack.pop();
                if (context_1 && context_1.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_1.objectType].listChange, context_1.changeListener);
                }
            }
            stack.push(context);
            return stack;
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
            while (stack.length > columnIndex) {
                var context_2 = stack.pop();
                if (context_2 && context_2.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_2.objectType].listChange, context_2.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    return ServicesRoute;
}());
exports.ServicesRoute = ServicesRoute;
