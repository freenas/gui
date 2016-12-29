"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var model_event_name_1 = require("../model-event-name");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var network_repository_1 = require("../repository/network-repository");
var NetworkRoute = (function () {
    function NetworkRoute(modelDescriptorService, eventDispatcherService, networkRepository) {
        this.modelDescriptorService = modelDescriptorService;
        this.eventDispatcherService = eventDispatcherService;
        this.networkRepository = networkRepository;
    }
    NetworkRoute.getInstance = function () {
        if (!NetworkRoute.instance) {
            NetworkRoute.instance = new NetworkRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), network_repository_1.NetworkRepository.getInstance());
        }
        return NetworkRoute.instance;
    };
    NetworkRoute.prototype.get = function (interfaceId, stack) {
        var self = this, objectType = 'NetworkInterface', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/network-interface/_/' + interfaceId
        };
        return Promise.all([
            this.networkRepository.listNetworkInterfaces(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (interfaces, uiDescriptor) {
            context.object = _.find(interfaces, { id: interfaceId });
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
    NetworkRoute.prototype.selectNewInterfaceType = function (stack) {
        var _this = this;
        var self = this, objectType = 'NetworkInterface', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            Promise.map(_.values(network_repository_1.NetworkRepository.INTERFACE_TYPES), function (type) { return _this.networkRepository.getNewInterfaceWithType(type); }),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (interfaces, uiDescriptor) {
            interfaces._objectType = objectType;
            context.object = _.compact(interfaces);
            context.userInterfaceDescriptor = uiDescriptor;
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
    NetworkRoute.prototype.create = function (interfaceType, stack) {
        var self = this, objectType = 'NetworkInterface', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/' + interfaceType
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            var newInterface = _.find(parentContext.object, { _tmpId: interfaceType });
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = newInterface;
            while (stack.length > columnIndex - 1) {
                var context_3 = stack.pop();
                if (context_3 && context_3.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_3.objectType].listChange, context_3.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    return NetworkRoute;
}());
exports.NetworkRoute = NetworkRoute;
