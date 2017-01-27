import * as _ from 'lodash';
import {VolumeRepository} from '../repository/volume-repository';
import {AbstractRoute} from './abstract-route';
import {Model} from '../model';

export class SnapshotRoute extends AbstractRoute {
    private static instance: SnapshotRoute;
    private objectType: string;

    public constructor(private volumeRepository: VolumeRepository) {
        super();
        this.objectType = Model.VolumeSnapshot;
    }


    public static getInstance() {
        if (!SnapshotRoute.instance) {
            SnapshotRoute.instance = new SnapshotRoute(
                VolumeRepository.getInstance()
            );
        }
        return SnapshotRoute.instance;
    }

    public list(volumeId: string, stack: Array<any>) {
        let columnIndex = 2;
        return this.loadListInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/volume-snapshot',
            Model.VolumeSnapshot,
            this.volumeRepository.listSnapshots(),
            {
                filter: {volume: volumeId}
            }
        );
    }

    public listForDataset(volumeId: string, datasetId: string, stack: Array<any>) {
        let columnIndex = 4;
        return this.loadListInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/volume-snapshot',
            Model.VolumeSnapshot,
            this.volumeRepository.listSnapshots(),
            {
                filter: {volume: volumeId, dataset: datasetId}
            }
        );
    }

    public create(volumeId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
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
        ]).spread(function(volumes: Array<any>, snapshot: any, uiDescriptor) {
            snapshot._volume = _.find(volumes, {id: volumeId});
            context.object = snapshot;
            context.userInterfaceDescriptor = uiDescriptor;


            return self.updateStackWithContext(stack, context);
        });
    }

    public createForDataset(volumeId: string, datasetId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 5,
            parentContext = stack[columnIndex - 1],
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
        ]).spread(function(volumes: Array<any>, datasets: Array<any>, snapshot: any, uiDescriptor) {
            snapshot._volume = _.find(volumes, {id: volumeId});
            snapshot._dataset = _.find(datasets, {id: datasetId});
            context.object = snapshot;
            context.userInterfaceDescriptor = uiDescriptor;


            return self.updateStackWithContext(stack, context);
        });
    }

    public get(volumeId: string, snapshotId: string, stack: Array<any>) {
        let columnIndex = 3;
        this.openSnapshotAtColumnIndex(volumeId, snapshotId, columnIndex, stack);
    }

    public getForDataset(volumeId: string, snapshotId: string, stack: Array<any>) {
        let columnIndex = 5;
        this.openSnapshotAtColumnIndex(volumeId, snapshotId, columnIndex, stack);
    }

    private openSnapshotAtColumnIndex(volumeId: string, snapshotId: string, columnIndex: number, stack: Array<any>) {
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
        ]).spread(function (volumes: Array<any>, snapshots: Array<any>, uiDescriptor) {
            let snapshot = _.find(snapshots, {id: snapshotId});
            snapshot._volume = _.find(volumes, {id: volumeId});
            context.object = snapshot;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }
}
