import {VolumeRepository} from "../repository/volume-repository";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {DataObjectChangeService} from "../service/data-object-change-service";
import {ModelEventName} from "../model-event-name";
import _ = require("lodash");
import Promise = require("bluebird");
import {AbstractRoute} from "./abstract-route";
import {Model} from "../model";

export class SnapshotRoute extends AbstractRoute {
    private static instance: SnapshotRoute;
    private objectType: string;

    private constructor(private volumeRepository: VolumeRepository,
                        eventDispatcherService: EventDispatcherService,
                        private modelDescriptorService: ModelDescriptorService,
                        private dataObjectChangeService: DataObjectChangeService) {
        super(eventDispatcherService);
        this.objectType = Model.VolumeSnapshot;
    }


    public static getInstance() {
        if (!SnapshotRoute.instance) {
            SnapshotRoute.instance = new SnapshotRoute(
                VolumeRepository.getInstance(),
                EventDispatcherService.getInstance(),
                ModelDescriptorService.getInstance(),
                new DataObjectChangeService()
            );
        }
        return SnapshotRoute.instance;
    }

    public list(volumeId: string, stack: Array<any>) {
        let self = this;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.volumeRepository.listSnapshots(),
            this.modelDescriptorService.getUiDescriptorForType(this.objectType)
        ]).spread(function(volumes, snapshots, uiDescriptor) {
            while (stack.length > 2) {
                let oldContext = stack.pop();
                if (oldContext && oldContext.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[oldContext.objectType].listChange, oldContext.changeListener);
                }
            }

            let filteredSnapshots = _.filter(snapshots, {volume: volumeId});
            filteredSnapshots._objectType = self.objectType;

            let context = {
                object: filteredSnapshots,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: self.objectType,
                parentContext: stack[1],
                path: stack[1].path + '/volume-snapshot',
                changeListener: self.eventDispatcherService.addEventListener(ModelEventName.VolumeSnapshot.listChange, function(state) {
                    self.dataObjectChangeService.handleDataChange(filteredSnapshots, state);
                    for (let i = filteredSnapshots.length - 1; i >= 0; i--) {
                        if (filteredSnapshots[i].volume !== volumeId) {
                            filteredSnapshots.splice(i, 1);
                        }
                    }
                })
            };

            stack.push(context);
            return stack;
        });
    }

    public listForDataset(volumeId: string, datasetId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 4,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/volume-snapshot'
            };
        return Promise.all([
            this.volumeRepository.listSnapshots(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function(snapshots, uiDescriptor) {
            let filteredSnapshots = _.filter(snapshots, {volume: volumeId, dataset: datasetId});
            filteredSnapshots._objectType = self.objectType;
            context.object = filteredSnapshots;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName.VolumeSnapshot.listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(filteredSnapshots, state);
                for (let i = filteredSnapshots.length - 1; i >= 0; i--) {
                    if (filteredSnapshots[i].volume !== volumeId || filteredSnapshots[i].dataset !== datasetId) {
                        filteredSnapshots.splice(i, 1);
                    }
                }
            });

            return self.updateStackWithContext(stack, context);
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
            this.volumeRepository.getNewVolumeSnapshot(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function(volumes, snapshot, uiDescriptor) {
            snapshot._volume = _.find(volumes, {id: volumeId});
            context.object = snapshot;
            context.userInterfaceDescriptor = uiDescriptor;


            return self.updateStackWithContext(stack, context);
        });
    }

    public createForDataset(volumeId: string, datasetId: string, stack: Array<any>) {
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
            this.volumeRepository.listVolumes(),
            this.volumeRepository.listDatasets(),
            this.volumeRepository.getNewVolumeSnapshot(),
            this.modelDescriptorService.getUiDescriptorForType(self.objectType)
        ]).spread(function(volumes, datasets, snapshot, uiDescriptor) {
            snapshot._volume = _.find(volumes, {id: volumeId});
            snapshot._dataset = _.find(datasets, {id: datasetId});
            context.object = snapshot;
            context.userInterfaceDescriptor = uiDescriptor;


            return self.updateStackWithContext(stack, context);
        });
    }

    public get(volumeId: string, snapshotId: string, stack: Array<any>) {
        this.openSnapshotAsColumnIndex(volumeId, snapshotId, 3, stack);
    }

    public getForDataset(volumeId: string, snapshotId: string, stack: Array<any>) {
        this.openSnapshotAsColumnIndex(volumeId, snapshotId, 5, stack);
    }

    private openSnapshotAsColumnIndex(volumeId: string, snapshotId: string, columnIndex: number, stack: Array<any>) {
        let self = this,
            parentContext = stack[columnIndex - 1],
            context: any = {
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
            let snapshot = _.find(snapshots, {id: snapshotId});
            snapshot._volume = _.find(volumes, {id: volumeId});
            context.object = snapshot;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }
}
