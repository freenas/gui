"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var volume_repository_1 = require("../repository/volume-repository");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var _ = require("lodash");
var Promise = require("bluebird");
var disk_repository_1 = require("../repository/disk-repository");
var abstract_route_1 = require("./abstract-route");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_1 = require("../model");
var VolumeRoute = (function (_super) {
    __extends(VolumeRoute, _super);
    function VolumeRoute(modelDescriptorService, eventDispatcherService, volumeRepository, diskRepository) {
        var _this = _super.call(this, eventDispatcherService) || this;
        _this.modelDescriptorService = modelDescriptorService;
        _this.volumeRepository = volumeRepository;
        _this.diskRepository = diskRepository;
        return _this;
    }
    VolumeRoute.getInstance = function () {
        if (!VolumeRoute.instance) {
            VolumeRoute.instance = new VolumeRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), volume_repository_1.VolumeRepository.getInstance(), disk_repository_1.DiskRepository.getInstance());
        }
        return VolumeRoute.instance;
    };
    VolumeRoute.prototype.get = function (volumeId, stack) {
        var objectType = model_1.Model.Volume;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (volumes, uiDescriptor) {
            while (stack.length > 1) {
                stack.pop();
            }
            stack.push({
                object: _.find(volumes, { id: volumeId }),
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 1,
                objectType: objectType,
                parentContext: stack[0],
                path: stack[0].path + '/volume/_/' + encodeURIComponent(volumeId)
            });
            return stack;
        });
    };
    VolumeRoute.prototype.topology = function (volumeId, stack) {
        var objectType = model_1.Model.ZfsTopology;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (volumes, uiDescriptor) {
            while (stack.length > 2) {
                stack.pop();
            }
            var volume = _.find(volumes, { id: volumeId }), topology = volume.topology;
            topology._volume = volume;
            stack.push({
                object: topology,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: objectType,
                parentContext: stack[1],
                path: stack[1].path + '/topology'
            });
            return stack;
        });
    };
    VolumeRoute.prototype.topologyDisk = function (diskId, stack) {
        this.openDiskAtColumnIndex(diskId, 3, stack);
    };
    VolumeRoute.prototype.creatorDisk = function (diskId, stack) {
        this.openDiskAtColumnIndex(diskId, 2, stack);
    };
    VolumeRoute.prototype.openDiskAtColumnIndex = function (diskId, columnIndex, stack) {
        var self = this, objectType = model_1.Model.Disk;
        return Promise.all([
            this.diskRepository.listDisks(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (disks, uiDescriptor) {
            var context = {
                object: _.find(disks, { id: diskId }),
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: stack[columnIndex - 1],
                path: stack[columnIndex - 1].path + '/disk'
            };
            return self.updateStackWithContext(stack, context);
        });
    };
    VolumeRoute.prototype.create = function (stack) {
        var objectType = model_1.Model.Volume;
        return Promise.all([
            this.volumeRepository.getNewVolume(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (volume, uiDescriptor) {
            while (stack.length > 1) {
                stack.pop();
            }
            stack.push({
                object: volume,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 1,
                objectType: objectType,
                parentContext: stack[0],
                path: stack[0].path + '/create'
            });
            return stack;
        });
    };
    VolumeRoute.prototype.import = function (stack) {
        var objectType = model_1.Model.VolumeImporter;
        return Promise.all([
            this.volumeRepository.getVolumeImporter(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (volumeImporter, uiDescriptor) {
            while (stack.length > 1) {
                stack.pop();
            }
            stack.push({
                object: volumeImporter,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 1,
                objectType: objectType,
                parentContext: stack[0],
                path: stack[0].path + '/volume-importer/_/-'
            });
            return stack;
        });
    };
    VolumeRoute.prototype.getDetachedVolume = function (volumeId, stack) {
        var self = this, columnIndex = 2, objectType = model_1.Model.DetachedVolume, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/detached-volume/_/' + encodeURIComponent(volumeId)
        };
        return Promise.all([
            this.volumeRepository.listDetachedVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (volumes, uiDescriptor) {
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = _.find(volumes, { id: _.toString(volumeId) });
            return self.updateStackWithContext(stack, context);
        });
    };
    VolumeRoute.prototype.getVolumeTopology = function (stack) {
        return this.openTopologyAtColumnIndex(2, stack);
    };
    VolumeRoute.prototype.getDetachedVolumeTopology = function (stack) {
        return this.openTopologyAtColumnIndex(3, stack).then(function (stack) {
            _.last(stack).object._isDetached = true;
            return stack;
        });
    };
    VolumeRoute.prototype.openTopologyAtColumnIndex = function (columnIndex, stack) {
        var self = this, objectType = model_1.Model.ZfsTopology, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/topology'
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            var topology = parentContext.object.topology;
            topology._volume = parentContext.object;
            context.object = topology;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    VolumeRoute.prototype.importEncrypted = function (stack) {
        var objectType = model_1.Model.EncryptedVolumeImporter;
        return Promise.all([
            this.volumeRepository.getEncryptedVolumeImporterInstance(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (encryptedVolumeImporter, uiDescriptor) {
            while (stack.length > 2) {
                stack.pop();
            }
            stack.push({
                object: encryptedVolumeImporter,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: objectType,
                parentContext: stack[1],
                path: stack[1].path + '/encrypted'
            });
            return stack;
        });
    };
    return VolumeRoute;
}(abstract_route_1.AbstractRoute));
exports.VolumeRoute = VolumeRoute;
