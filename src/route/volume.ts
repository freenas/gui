import {VolumeRepository} from '../repository/volume-repository';
import {ModelDescriptorService} from '../service/model-descriptor-service';
import _ = require('lodash');
import Promise = require('bluebird');
import {DiskRepository} from '../repository/disk-repository';
import {AbstractRoute} from './abstract-route';
import {EventDispatcherService} from '../service/event-dispatcher-service';
import {Model} from '../model';

export class VolumeRoute extends AbstractRoute {
    private static instance: VolumeRoute;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService,
                        private volumeRepository: VolumeRepository,
                        private diskRepository: DiskRepository) {
        super(eventDispatcherService);
    }

    public static getInstance() {
        if (!VolumeRoute.instance) {
            VolumeRoute.instance = new VolumeRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                VolumeRepository.getInstance(),
                DiskRepository.getInstance()
            );
        }
        return VolumeRoute.instance;
    }

    public get(volumeId: string, stack: Array<any>) {
        let objectType = Model.Volume;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumes, uiDescriptor) {
            while (stack.length > 1) {
                stack.pop();
            }
            stack.push({
                    object: _.find(volumes, {id: volumeId}),
                    userInterfaceDescriptor: uiDescriptor,
                    columnIndex: 1,
                    objectType: objectType,
                    parentContext: stack[0],
                    path: stack[0].path + '/volume/_/' + encodeURIComponent(volumeId)
                });
            return stack;
        });
    }

    public topology(volumeId: string, stack: Array<any>) {
        let objectType = Model.ZfsTopology;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumes, uiDescriptor) {
            while (stack.length > 2) {
                stack.pop();
            }
            let volume = _.find(volumes, {id: volumeId}),
                topology = volume.topology;
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
    }

    public topologyDisk(diskId: string, stack: Array<any>) {
        this.openDiskAtColumnIndex(diskId, 3, stack);
    }

    public creatorDisk(diskId: string, stack: Array<any>) {
        this.openDiskAtColumnIndex(diskId, 2, stack);
    }

    private openDiskAtColumnIndex(diskId: string, columnIndex: number, stack: Array<any>) {
        let self = this,
            objectType = Model.Disk;
        return Promise.all([
            this.diskRepository.listDisks(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (disks, uiDescriptor) {
            let context = {
                object: _.find(disks, {id: diskId}),
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: stack[columnIndex - 1],
                path: stack[columnIndex - 1].path + '/disk'
            };
            return self.updateStackWithContext(stack, context);
        });
    }

    public create(stack: Array<any>) {
        let objectType = Model.Volume;
        return Promise.all([
            this.volumeRepository.getNewVolume(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volume, uiDescriptor) {
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
    }

    public import(stack: Array<any>) {
        let objectType = Model.VolumeImporter;
        return Promise.all([
            this.volumeRepository.getVolumeImporter(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumeImporter, uiDescriptor) {
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
    }

    public mediaImport(stack: Array<any>) {
        return Promise.all([
            this.volumeRepository.getVolumeMediaImporter(),
            this.modelDescriptorService.getUiDescriptorForType('VolumeMediaImporter')
        ]).spread(function(volumeMediaImporter, uiDescriptor) {
            while (stack.length > 1) {
                stack.pop();
            }
            stack.push({
                object: volumeMediaImporter,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 1,
                objectType: 'VolumeMediaImporter',
                parentContext: stack[0],
                path: stack[0].path + '/volume-media-importer/_/-'
            });
            return stack;
        });
    }

    public getDetachedVolume(volumeId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 2,
            objectType = Model.DetachedVolume,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/detached-volume/_/' + encodeURIComponent(volumeId)
            };
        return Promise.all([
            this.volumeRepository.listDetachedVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumes: Array<any>, uiDescriptor) {
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = _.find(volumes, {id: _.toString(volumeId)});
            return self.updateStackWithContext(stack, context);
        });
    }

    public getVolumeTopology(stack: Array<any>) {
        return this.openTopologyAtColumnIndex(2, stack);
    }

    public getDetachedVolumeTopology(stack: Array<any>) {
        return this.openTopologyAtColumnIndex(3, stack).then(function(stack) {
            _.last(stack).object._isDetached = true;
            return stack;
        });
    }

    private openTopologyAtColumnIndex(columnIndex: number, stack: Array<any>) {
        let self = this,
            objectType = Model.ZfsTopology,
            parentContext = stack[columnIndex - 1],
            context = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/topology'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            let topology = parentContext.object.topology;
            topology._volume = parentContext.object;
            context.object = topology;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public importEncrypted(stack: Array<any>) {
        let objectType = Model.EncryptedVolumeImporter;
        return Promise.all([
            this.volumeRepository.getEncryptedVolumeImporterInstance(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(encryptedVolumeImporter, uiDescriptor) {
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
    }
}

