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
                    path: stack[0].path + '/volume/_/' + volumeId
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

