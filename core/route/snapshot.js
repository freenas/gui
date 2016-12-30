"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var volume_repository_1 = require("../repository/volume-repository");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var data_object_change_service_1 = require("../service/data-object-change-service");
var model_event_name_1 = require("../model-event-name");
var _ = require("lodash");
var Promise = require("bluebird");
var abstract_route_1 = require("./abstract-route");
var SnapshotRoute = (function (_super) {
    __extends(SnapshotRoute, _super);
    function SnapshotRoute(volumeRepository, eventDispatcherService, modelDescriptorService, dataObjectChangeService) {
        _super.call(this, eventDispatcherService);
        this.volumeRepository = volumeRepository;
        this.modelDescriptorService = modelDescriptorService;
        this.dataObjectChangeService = dataObjectChangeService;
        this.objectType = 'VolumeSnapshot';
    }
    SnapshotRoute.getInstance = function () {
        if (!SnapshotRoute.instance) {
            SnapshotRoute.instance = new SnapshotRoute(volume_repository_1.VolumeRepository.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), model_descriptor_service_1.ModelDescriptorService.getInstance(), new data_object_change_service_1.DataObjectChangeService());
        }
        return SnapshotRoute.instance;
    };
    SnapshotRoute.prototype.list = function (volumeId, stack) {
        var self = this;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.listSnapshots(),
            this.modelDescriptorService.getUiDescriptorForType(this.objectType)
        ]).spread(function (volumes, snapshots, uiDescriptor) {
            while (stack.length > 2) {
                var oldContext = stack.pop();
                if (oldContext && oldContext.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[oldContext.objectType].listChange, oldContext.changeListener);
                }
            }
            var filteredSnapshots = _.filter(snapshots, { volume: volumeId });
            filteredSnapshots._objectType = self.objectType;
            var context = {
                object: filteredSnapshots,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: self.objectType,
                parentContext: stack[1],
                path: stack[1].path + '/volume-snapshot',
                changeListener: self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.VolumeSnapshot.listChange, function (state) {
                    self.dataObjectChangeService.handleDataChange(filteredSnapshots, state);
                    for (var i = filteredSnapshots.length - 1; i >= 0; i--) {
                        if (filteredSnapshots[i].volume !== volumeId) {
                            filteredSnapshots.splice(i, 1);
                        }
                    }
                })
            };
            stack.push(context);
            return stack;
        });
    };
    SnapshotRoute.prototype.listForDataset = function (volumeId, datasetId, stack) {
        var self = this, columnIndex = 4, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/volume-snapshot'
        };
        return Promise.all([
            this.volumeRepository.listSnapshots(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function (snapshots, uiDescriptor) {
            var filteredSnapshots = _.filter(snapshots, { volume: volumeId, dataset: datasetId });
            filteredSnapshots._objectType = self.objectType;
            context.object = filteredSnapshots;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.VolumeSnapshot.listChange, function (state) {
                self.dataObjectChangeService.handleDataChange(filteredSnapshots, state);
                for (var i = filteredSnapshots.length - 1; i >= 0; i--) {
                    if (filteredSnapshots[i].volume !== volumeId || filteredSnapshots[i].dataset !== datasetId) {
                        filteredSnapshots.splice(i, 1);
                    }
                }
            });
            return self.updateStackWithContext(stack, context);
        });
    };
    SnapshotRoute.prototype.create = function (volumeId, stack) {
        var self = this, columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.getNewVolumeSnapshot(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function (volumes, snapshot, uiDescriptor) {
            snapshot._volume = _.find(volumes, { id: volumeId });
            context.object = snapshot;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    SnapshotRoute.prototype.createForDataset = function (volumeId, datasetId, stack) {
        var self = this, columnIndex = 5, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.listDatasets(),
            this.volumeRepository.getNewVolumeSnapshot(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function (volumes, datasets, snapshot, uiDescriptor) {
            snapshot._volume = _.find(volumes, { id: volumeId });
            snapshot._dataset = _.find(datasets, { id: datasetId });
            context.object = snapshot;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    SnapshotRoute.prototype.get = function (volumeId, snapshotId, stack) {
        this.openSnapshotAsColumnIndex(volumeId, snapshotId, 3, stack);
    };
    SnapshotRoute.prototype.getForDataset = function (volumeId, snapshotId, stack) {
        this.openSnapshotAsColumnIndex(volumeId, snapshotId, 5, stack);
    };
    SnapshotRoute.prototype.openSnapshotAsColumnIndex = function (volumeId, snapshotId, columnIndex, stack) {
        var self = this, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + encodeURIComponent(snapshotId)
        };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.listSnapshots(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function (volumes, snapshots, uiDescriptor) {
            var snapshot = _.find(snapshots, { id: snapshotId });
            snapshot._volume = _.find(volumes, { id: volumeId });
            context.object = snapshot;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    return SnapshotRoute;
}(abstract_route_1.AbstractRoute));
exports.SnapshotRoute = SnapshotRoute;
