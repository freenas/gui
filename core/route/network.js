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
var network_repository_1 = require("../repository/network-repository");
var abstract_route_1 = require("./abstract-route");
var NetworkRoute = (function (_super) {
    __extends(NetworkRoute, _super);
    function NetworkRoute(modelDescriptorService, eventDispatcherService, networkRepository) {
        var _this = _super.call(this, eventDispatcherService) || this;
        _this.modelDescriptorService = modelDescriptorService;
        _this.networkRepository = networkRepository;
        return _this;
    }
    NetworkRoute.getInstance = function () {
        if (!NetworkRoute.instance) {
            NetworkRoute.instance = new NetworkRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), network_repository_1.NetworkRepository.getInstance());
        }
        return NetworkRoute.instance;
    };
    NetworkRoute.prototype.get = function (interfaceId, stack) {
        var self = this, objectType = Model.NetworkInterface, columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/network-interface/_/' + encodeURIComponent(interfaceId)
        };
        return Promise.all([
            this.networkRepository.listNetworkInterfaces(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (interfaces, uiDescriptor) {
            context.object = _.find(interfaces, { id: interfaceId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    NetworkRoute.prototype.selectNewInterfaceType = function (stack) {
        var _this = this;
        var self = this, objectType = Model.NetworkInterface, columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            isCreatePrevented: true,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            Promise.map(_.values(network_repository_1.NetworkRepository.INTERFACE_TYPES), function (type) { return _this.networkRepository.getNewInterfaceWithType(type); }),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (interfaces, uiDescriptor) {
            interfaces._objectType = objectType;
            context.object = _.compact(interfaces);
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    NetworkRoute.prototype.create = function (interfaceType, stack) {
        var self = this, objectType = Model.NetworkInterface, columnIndex = 1, parentContext = stack[columnIndex], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/' + interfaceType
        };
        return this.modelDescriptorService.getUiDescriptorForType(objectType)
            .then(function (uiDescriptor) {
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = _.find(parentContext.object, { _tmpId: interfaceType });
            return self.updateStackWithContext(stack, context);
        });
    };
    NetworkRoute.prototype.listIpmi = function (stack) {
        var self = this, objectType = Model.Ipmi, columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/ipmi'
        };
        return Promise.all([
            this.networkRepository.listIpmiChannels(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (ipmi, uiDescriptor) {
            ipmi._objectType = objectType;
            context.object = ipmi;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    NetworkRoute.prototype.getIpmi = function (ipmiId, stack) {
        var self = this, objectType = Model.Ipmi, columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/ipmi/_/' + encodeURIComponent(ipmiId)
        };
        return Promise.all([
            this.networkRepository.listIpmiChannels(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (ipmi, uiDescriptor) {
            context.object = _.find(ipmi, { id: +ipmiId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    return NetworkRoute;
}(abstract_route_1.AbstractRoute));
exports.NetworkRoute = NetworkRoute;
