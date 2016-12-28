"use strict";
var volume_repository_1 = require("../repository/volume-repository");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var _ = require("lodash");
var Promise = require("bluebird");
var disk_repository_1 = require("../repository/disk-repository");
var VolumeRoute = (function () {
    function VolumeRoute(modelDescriptorService, volumeRepository, diskRepository) {
        this.modelDescriptorService = modelDescriptorService;
        this.volumeRepository = volumeRepository;
        this.diskRepository = diskRepository;
    }
    VolumeRoute.getInstance = function () {
        if (!VolumeRoute.instance) {
            VolumeRoute.instance = new VolumeRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), volume_repository_1.VolumeRepository.getInstance(), disk_repository_1.DiskRepository.getInstance());
        }
        return VolumeRoute.instance;
    };
    VolumeRoute.prototype.get = function (volumeId, stack) {
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType('Volume')
        ]).spread(function (volumes, uiDescriptor) {
            while (stack.length > 1) {
                stack.pop();
            }
            stack.push({
                object: _.find(volumes, { id: volumeId }),
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 1,
                objectType: 'Volume',
                parentContext: stack[0],
                path: stack[0].path + '/volume/_/' + volumeId
            });
            return stack;
        });
    };
    VolumeRoute.prototype.topology = function (volumeId, stack) {
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType('ZfsTopology')
        ]).spread(function (volumes, uiDescriptor) {
            while (stack.length > 2) {
                stack.pop();
            }
            stack.push({
                object: _.find(volumes, { id: volumeId }).topology,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: 'ZfsTopology',
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
        return Promise.all([
            this.diskRepository.listDisks(),
            this.modelDescriptorService.getUiDescriptorForType('Disk')
        ]).spread(function (disks, uiDescriptor) {
            while (stack.length > columnIndex) {
                stack.pop();
            }
            stack.push({
                object: _.find(disks, { id: diskId }),
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: columnIndex,
                objectType: 'Disk',
                parentContext: stack[columnIndex - 1],
                path: stack[columnIndex - 1].path + '/disk'
            });
            return stack;
        });
    };
    VolumeRoute.prototype.create = function (stack) {
        return Promise.all([
            this.volumeRepository.getNewVolume(),
            this.modelDescriptorService.getUiDescriptorForType('Volume')
        ]).spread(function (volume, uiDescriptor) {
            while (stack.length > 1) {
                stack.pop();
            }
            stack.push({
                object: volume,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 1,
                objectType: 'Volume',
                parentContext: stack[0],
                path: stack[0].path + '/create'
            });
            return stack;
        });
    };
    VolumeRoute.prototype.import = function (stack) {
        return Promise.all([
            this.volumeRepository.getVolumeImporter(),
            this.modelDescriptorService.getUiDescriptorForType('VolumeImporter')
        ]).spread(function (volumeImporter, uiDescriptor) {
            while (stack.length > 1) {
                stack.pop();
            }
            stack.push({
                object: volumeImporter,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 1,
                objectType: 'VolumeImporter',
                parentContext: stack[0],
                path: stack[0].path + '/volume-importer/_/-'
            });
            return stack;
        });
    };
    VolumeRoute.prototype.importEncrypted = function (stack) {
        return Promise.all([
            this.volumeRepository.getEncryptedVolumeImporterInstance(),
            this.modelDescriptorService.getUiDescriptorForType('EncryptedVolumeImporter')
        ]).spread(function (encryptedVolumeImporter, uiDescriptor) {
            while (stack.length > 2) {
                stack.pop();
            }
            stack.push({
                object: encryptedVolumeImporter,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: 'EncryptedVolumeImporter',
                parentContext: stack[1],
                path: stack[1].path + '/encrypted'
            });
            return stack;
        });
    };
    return VolumeRoute;
}());
exports.VolumeRoute = VolumeRoute;
