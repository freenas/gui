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
        _super.call(this, eventDispatcherService);
        this.modelDescriptorService = modelDescriptorService;
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
        var self = this, objectType = 'NetworkInterface', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
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
        var self = this, objectType = 'NetworkInterface', columnIndex = 1, parentContext = stack[columnIndex], context = {
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
            return self.updateStackWithContext(stack, context);
        });
    };
    return NetworkRoute;
}(abstract_route_1.AbstractRoute));
exports.NetworkRoute = NetworkRoute;
