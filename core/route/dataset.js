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
var replication_repository_1 = require("../repository/replication-repository");
var vmware_repository_1 = require("../repository/vmware-repository");
var abstract_route_1 = require("./abstract-route");
var DatasetRoute = (function (_super) {
    __extends(DatasetRoute, _super);
    function DatasetRoute(volumeRepository, replicationRepository, vmwareRepository, eventDispatcherService, modelDescriptorService, dataObjectChangeService) {
        _super.call(this, eventDispatcherService);
        this.volumeRepository = volumeRepository;
        this.replicationRepository = replicationRepository;
        this.vmwareRepository = vmwareRepository;
        this.modelDescriptorService = modelDescriptorService;
        this.dataObjectChangeService = dataObjectChangeService;
        this.objectType = 'VolumeDataset';
    }
    DatasetRoute.getInstance = function () {
        if (!DatasetRoute.instance) {
            DatasetRoute.instance = new DatasetRoute(volume_repository_1.VolumeRepository.getInstance(), replication_repository_1.ReplicationRepository.getInstance(), vmware_repository_1.VmwareRepository.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), model_descriptor_service_1.ModelDescriptorService.getInstance(), new data_object_change_service_1.DataObjectChangeService());
        }
        return DatasetRoute.instance;
    };
    DatasetRoute.prototype.list = function (volumeId, stack) {
        var self = this;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.listDatasets(),
            this.modelDescriptorService.getUiDescriptorForType(this.objectType)
        ]).spread(function (volumes, datasets, uiDescriptor) {
            while (stack.length > 2) {
                var oldContext = stack.pop();
                if (oldContext && oldContext.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[oldContext.objectType].listChange, oldContext.changeListener);
                }
            }
            var filteredDatasets = _.filter(datasets, { volume: volumeId });
            filteredDatasets._objectType = self.objectType;
            var context = {
                object: filteredDatasets,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: self.objectType,
                parentContext: stack[1],
                path: stack[1].path + '/volume-dataset',
                changeListener: self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.VolumeDataset.listChange, function (state) {
                    self.dataObjectChangeService.handleDataChange(filteredDatasets, state);
                    for (var i = filteredDatasets.length - 1; i >= 0; i--) {
                        if (filteredDatasets[i].volume !== volumeId) {
                            filteredDatasets.splice(i, 1);
                        }
                    }
                })
            };
            stack.push(context);
            return stack;
        });
    };
    DatasetRoute.prototype.create = function (volumeId, stack) {
        var self = this, columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.getNewVolumeDataset(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function (volumes, dataset, uiDescriptor) {
            dataset._volume = _.find(volumes, { id: volumeId });
            context.object = dataset;
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
    DatasetRoute.prototype.get = function (volumeId, datasetId, stack) {
        var self = this, columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + datasetId
        };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.listDatasets(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function (volumes, datasets, uiDescriptor) {
            var dataset = _.find(datasets, { id: datasetId });
            dataset._volume = _.find(volumes, { id: volumeId });
            context.object = dataset;
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
    DatasetRoute.prototype.replication = function (datasetId, stack) {
        var self = this, columnIndex = 4, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/replication'
        };
        return Promise.all([
            this.replicationRepository.getReplicationOptionsInstance(),
            this.modelDescriptorService.getUiDescriptorForType('ReplicationOptions')
        ]).spread(function (replicationOptions, uiDescriptor) {
            replicationOptions._dataset = datasetId;
            context.object = replicationOptions;
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
    DatasetRoute.prototype.listVmware = function (datasetId, stack) {
        var self = this, columnIndex = 4, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/vmware-dataset'
        };
        return Promise.all([
            this.vmwareRepository.listDatasets(),
            this.modelDescriptorService.getUiDescriptorForType('VmwareDataset')
        ]).spread(function (vmwareDatasets, uiDescriptor) {
            var filteredVmwareDatasets = _.filter(vmwareDatasets, { dataset: datasetId });
            filteredVmwareDatasets._objectType = 'VmwareDataset';
            context.object = filteredVmwareDatasets;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.VmwareDataset.listChange, function (state) {
                self.dataObjectChangeService.handleDataChange(filteredVmwareDatasets, state);
                for (var i = filteredVmwareDatasets.length - 1; i >= 0; i--) {
                    if (filteredVmwareDatasets[i].dataset !== datasetId) {
                        filteredVmwareDatasets.splice(i, 1);
                    }
                }
            });
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
    DatasetRoute.prototype.createVmware = function (datasetId, stack) {
        var self = this, columnIndex = 5, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.vmwareRepository.getNewVmwareDataset(),
            this.modelDescriptorService.getUiDescriptorForType('VmwareDataset')
        ]).spread(function (vmwareDataset, uiDescriptor) {
            vmwareDataset.dataset = datasetId;
            context.object = vmwareDataset;
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
    DatasetRoute.prototype.getVmware = function (vmwareDatasetId, stack) {
        var self = this, columnIndex = 5, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + vmwareDatasetId
        };
        return Promise.all([
            this.vmwareRepository.listDatasets(),
            this.modelDescriptorService.getUiDescriptorForType('VmwareDataset')
        ]).spread(function (vmwareDatasets, uiDescriptor) {
            context.object = _.find(vmwareDatasets, { id: vmwareDatasetId });
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
    return DatasetRoute;
}(abstract_route_1.AbstractRoute));
exports.DatasetRoute = DatasetRoute;
