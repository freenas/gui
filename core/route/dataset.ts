import {VolumeRepository} from "../repository/volume-repository";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {DataObjectChangeService} from "../service/data-object-change-service";
import {ModelEventName} from "../model-event-name";
import _ = require("lodash");
import Promise = require("bluebird");
import {ReplicationRepository} from "../repository/replication-repository";

export class DatasetRoute {
    private static instance: DatasetRoute;
    private objectType: string;

    private constructor(private volumeRepository: VolumeRepository,
                        private replicationRepository: ReplicationRepository,
                        private eventDispatcherService: EventDispatcherService,
                        private modelDescriptorService: ModelDescriptorService,
                        private dataObjectChangeService: DataObjectChangeService) {
        this.objectType = 'VolumeDataset';
    }


    public static getInstance() {
        if (!DatasetRoute.instance) {
            DatasetRoute.instance = new DatasetRoute(
                VolumeRepository.getInstance(),
                ReplicationRepository.getInstance(),
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
                path: parentContext.path + '/_/'+datasetId
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
}
