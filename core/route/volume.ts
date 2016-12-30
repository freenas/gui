import {VolumeRepository} from "../repository/volume-repository";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import _ = require("lodash");
import Promise = require("bluebird");
import {DiskRepository} from "../repository/disk-repository";
import {AbstractRoute} from "./abstract-route";
import {EventDispatcherService} from "../service/event-dispatcher-service";

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
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType('Volume')
        ]).spread(function(volumes, uiDescriptor) {
            while (stack.length > 1) {
                stack.pop();
            }
            stack.push({
                    object: _.find(volumes, {id: volumeId}),
                    userInterfaceDescriptor: uiDescriptor,
                    columnIndex: 1,
                    objectType: 'Volume',
                    parentContext: stack[0],
                    path: stack[0].path + '/volume/_/' + encodeURIComponent(volumeId)
                });
            return stack;
        })
    }

    public topology(volumeId: string, stack:Array<any>) {
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType('ZfsTopology')
        ]).spread(function(volumes, uiDescriptor) {
            while (stack.length > 2) {
                stack.pop();
            }
            stack.push({
                object: _.find(volumes, {id: volumeId}).topology,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: 'ZfsTopology',
                parentContext: stack[1],
                path: stack[1].path + '/topology'
            });
            return stack;
        });
    }

    public topologyDisk(diskId: string, stack:Array<any>) {
        this.openDiskAtColumnIndex(diskId, 3, stack);
    }

    public creatorDisk(diskId: string, stack:Array<any>) {
        this.openDiskAtColumnIndex(diskId, 2, stack);
    }

    private openDiskAtColumnIndex(diskId: string, columnIndex: number, stack: Array<any>) {
        let self = this;
        return Promise.all([
            this.diskRepository.listDisks(),
            this.modelDescriptorService.getUiDescriptorForType('Disk')
        ]).spread(function (disks, uiDescriptor) {
            let context = {
                object: _.find(disks, {id: diskId}),
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: columnIndex,
                objectType: 'Disk',
                parentContext: stack[columnIndex - 1],
                path: stack[columnIndex - 1].path + '/disk'
            };
            return self.updateStackWithContext(stack, context);
        });
    }

    public create(stack: Array<any>) {
        return Promise.all([
            this.volumeRepository.getNewVolume(),
            this.modelDescriptorService.getUiDescriptorForType('Volume')
        ]).spread(function(volume, uiDescriptor) {
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
    }

    public import(stack: Array<any>) {
        return Promise.all([
            this.volumeRepository.getVolumeImporter(),
            this.modelDescriptorService.getUiDescriptorForType('VolumeImporter')
        ]).spread(function(volumeImporter, uiDescriptor) {
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
    }

    public getDetachedVolume(volumeId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 2,
            objectType = 'DetachedVolume',
            parentContext = stack[columnIndex-1],
            context = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/detached-volume/_/' + encodeURIComponent(volumeId)
            };
        return Promise.all([
            this.volumeRepository.listDetachedVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumes, uiDescriptor) {
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = _.find(volumes, {id: volumeId});
            return self.updateStackWithContext(stack, context);
        })
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
            objectType = 'ZfsTopology',
            parentContext = stack[columnIndex-1],
            context = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/topology'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = parentContext.object.topology;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        })
    }

    public importEncrypted(stack: Array<any>) {
        return Promise.all([
            this.volumeRepository.getEncryptedVolumeImporterInstance(),
            this.modelDescriptorService.getUiDescriptorForType('EncryptedVolumeImporter')
        ]).spread(function(encryptedVolumeImporter, uiDescriptor) {
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
    }
}

