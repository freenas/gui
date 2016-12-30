import {VolumeRepository} from "../repository/volume-repository";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {DataObjectChangeService} from "../service/data-object-change-service";
import {ModelEventName} from "../model-event-name";
import _ = require("lodash");
import Promise = require("bluebird");
import {ReplicationRepository} from "../repository/replication-repository";
import {VmwareRepository} from "../repository/vmware-repository";
import {AbstractRoute} from "./abstract-route";

export class DatasetRoute extends AbstractRoute {
    private static instance: DatasetRoute;
    private objectType: string;

    private constructor(private volumeRepository: VolumeRepository,
                        private replicationRepository: ReplicationRepository,
                        private vmwareRepository: VmwareRepository,
                        eventDispatcherService: EventDispatcherService,
                        private modelDescriptorService: ModelDescriptorService,
                        private dataObjectChangeService: DataObjectChangeService) {
        super(eventDispatcherService);
        this.objectType = 'VolumeDataset';
    }


    public static getInstance() {
        if (!DatasetRoute.instance) {
            DatasetRoute.instance = new DatasetRoute(
                VolumeRepository.getInstance(),
                ReplicationRepository.getInstance(),
                VmwareRepository.getInstance(),
                EventDispatcherService.getInstance(),
                ModelDescriptorService.getInstance(),
                new DataObjectChangeService()
            );
        }
        return DatasetRoute.instance;
    }

    public list(volumeId: string, stack: Array<any>) {
        let self = this;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.listDatasets(),
            this.modelDescriptorService.getUiDescriptorForType(this.objectType)
        ]).spread(function(volumes, datasets, uiDescriptor) {
            while (stack.length > 2) {
                let oldContext = stack.pop();
                if (oldContext && oldContext.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[oldContext.objectType].listChange, oldContext.changeListener);
                }
            }

            let filteredDatasets = _.filter(datasets, {volume: volumeId});
            filteredDatasets._objectType = self.objectType;

            let context = {
                object: filteredDatasets,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: self.objectType,
                parentContext: stack[1],
                path: stack[1].path + '/volume-dataset',
                changeListener: self.eventDispatcherService.addEventListener(ModelEventName.VolumeDataset.listChange, function(state) {
                    self.dataObjectChangeService.handleDataChange(filteredDatasets, state);
                    for (let i = filteredDatasets.length - 1; i >= 0; i--) {
                        if (filteredDatasets[i].volume !== volumeId) {
                            filteredDatasets.splice(i, 1);
                        }
                    }
                })
            };

            stack.push(context);
            return stack;
        });
    }

    public create(volumeId: string, stack: Array<any>) {

        let self = this,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.getNewVolumeDataset(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function(volumes, dataset, uiDescriptor) {
            dataset._volume = _.find(volumes, {id: volumeId});
            context.object = dataset;
            context.userInterfaceDescriptor = uiDescriptor;


            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public get(volumeId: string, datasetId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(datasetId)
            };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.listDatasets(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function(volumes, datasets, uiDescriptor) {
            let dataset = _.find(datasets, {id: datasetId});
            dataset._volume = _.find(volumes, {id: volumeId});
            context.object = dataset;
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public replication(datasetId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 4,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/replication'
            };
        return Promise.all([
            this.replicationRepository.getReplicationOptionsInstance(),
            this.modelDescriptorService.getUiDescriptorForType('ReplicationOptions')
        ]).spread(function(replicationOptions, uiDescriptor) {
            replicationOptions._dataset = datasetId;
            context.object = replicationOptions;
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public listVmware(datasetId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 4,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vmware-dataset'
            };
        return Promise.all([
            this.vmwareRepository.listDatasets(),
            this.modelDescriptorService.getUiDescriptorForType('VmwareDataset')
        ]).spread(function(vmwareDatasets, uiDescriptor) {
            let filteredVmwareDatasets = _.filter(vmwareDatasets, {dataset: datasetId});
            filteredVmwareDatasets._objectType = 'VmwareDataset';
            context.object = filteredVmwareDatasets;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName.VmwareDataset.listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(filteredVmwareDatasets, state);
                for (let i = filteredVmwareDatasets.length - 1; i >= 0; i--) {
                    if (filteredVmwareDatasets[i].dataset !== datasetId) {
                        filteredVmwareDatasets.splice(i, 1);
                    }
                }
            });

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public createVmware(datasetId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 5,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.vmwareRepository.getNewVmwareDataset(),
            this.modelDescriptorService.getUiDescriptorForType('VmwareDataset')
        ]).spread(function(vmwareDataset, uiDescriptor) {
            vmwareDataset.dataset = datasetId;
            context.object = vmwareDataset;
            context.userInterfaceDescriptor = uiDescriptor;


            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public getVmware(vmwareDatasetId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 5,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(vmwareDatasetId)
            };
        return Promise.all([
            this.vmwareRepository.listDatasets(),
            this.modelDescriptorService.getUiDescriptorForType('VmwareDataset')
        ]).spread(function(vmwareDatasets, uiDescriptor) {
            context.object = _.find(vmwareDatasets, {id: vmwareDatasetId});
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }
}
