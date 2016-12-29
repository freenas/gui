"use strict";
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var vm_repository_1 = require('core/repository/vm-repository');
var _ = require("lodash");
var model_event_name_1 = require("../model-event-name");
var VmsRoute = (function () {
    function VmsRoute(modelDescriptorService, eventDispatcherService, vmRepository) {
        this.modelDescriptorService = modelDescriptorService;
        this.eventDispatcherService = eventDispatcherService;
        this.vmRepository = vmRepository;
    }
    VmsRoute.getInstance = function () {
        if (!VmsRoute.instance) {
            VmsRoute.instance = new VmsRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), vm_repository_1.VmRepository.instance);
        }
        return VmsRoute.instance;
    };
    VmsRoute.prototype.get = function (vmId, stack) {
        var self = this, objectType = 'Vm', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/vm/_/' + vmId
        };
        return Promise.all([
            this.vmRepository.listVms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (vms, uiDescriptor) {
            context.object = _.find(vms, { id: vmId });
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
    VmsRoute.prototype.getReadme = function (stack) {
        var self = this, objectType = 'VmReadme', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/readme'
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            context.object = parentContext.object._readme;
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
    VmsRoute.prototype.getDevices = function (stack) {
        var self = this, objectType = 'VmDevice', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/devices'
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            context.object = _.forEach(parentContext.object._nonVolumeDevices, function (device) { return device._objectType = objectType; });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_3 = stack.pop();
                if (context_3 && context_3.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_3.objectType].listChange, context_3.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    VmsRoute.prototype.getDevice = function (deviceId, stack) {
        var self = this, objectType = 'VmDevice', columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/vm-device/_/' + deviceId
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            context.object = _.find(parentContext.object, { id: deviceId });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_4 = stack.pop();
                if (context_4 && context_4.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_4.objectType].listChange, context_4.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    VmsRoute.prototype.getVolumes = function (stack) {
        var self = this, objectType = 'VmVolume', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/volumes'
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            context.object = _.forEach(parentContext.object._volumeDevices, function (device) { return device._objectType = objectType; });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_5 = stack.pop();
                if (context_5 && context_5.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_5.objectType].listChange, context_5.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    VmsRoute.prototype.getVolume = function (volumeId, stack) {
        var self = this, objectType = 'VmVolume', columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/vm-volume/_/' + volumeId
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            context.object = _.find(parentContext.object, { id: volumeId });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_6 = stack.pop();
                if (context_6 && context_6.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_6.objectType].listChange, context_6.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    return VmsRoute;
}());
exports.VmsRoute = VmsRoute;
