import {AbstractRoute} from './abstract-route';
import {Model} from '../model';
import {VmRepository} from '../repository/vm-repository';
import {ModelEventName} from '../model-event-name';
import * as _ from 'lodash';
import {VmDatastoreRepository} from '../repository/VmDatastoreRepository';

export class VmsRoute extends AbstractRoute {
    private static instance: VmsRoute;

    private constructor(
        private vmRepository: VmRepository,
        private vmDatastoreRepository: VmDatastoreRepository
    ) {
        super();
    }

    public static getInstance() {
        if (!VmsRoute.instance) {
            VmsRoute.instance = new VmsRoute(
                VmRepository.getInstance(),
                VmDatastoreRepository.getInstance()
            );
        }
        return VmsRoute.instance;
    }

    public get(vmId: string, stack: Array<any>) {
        let columnIndex = 1;
        return this.getVmWithIdAtColumnIndex(stack[columnIndex - 1].object.entries, vmId, stack, columnIndex);
    }

    public create(stack: Array<any>) {
        let self = this,
            objectType = Model.Vm,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.vmRepository.getNewVm(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vm, uiDescriptor) {
            context.object = vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getReadme(stack: Array<any>) {
        let self = this,
            objectType = Model.VmReadme,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/readme'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = parentContext.object._readme;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public listDevices(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/devices'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = parentContext.object._nonVolumeDevices;
            context.object._vm = parentContext.object;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getDevice(deviceId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-device/_/' + encodeURIComponent(deviceId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {id: deviceId});
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public selectNewDeviceType(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                isCreatePrevented: true,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            Promise.all(_.map(_.values(this.vmRepository.DEVICE_TYPE), (type: string) => this.vmRepository.getNewVmDeviceForType(type))),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vmdevices: Array<any>, uiDescriptor) {
            context.object = _.compact(vmdevices);
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createDevice(deviceType: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + encodeURIComponent(deviceType)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {_tmpId: deviceType});
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public listVolumes(stack: Array<any>) {
        let self = this,
            objectType = Model.VmVolume,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/volumes'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.reject(parentContext.object._volumeDevices, {properties: {type: 'NFS'}});
            context.object._vm = parentContext.object;
            context.object._objectType = objectType;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getVolume(volumeId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmVolume,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-volume/_/' + encodeURIComponent(volumeId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {id: volumeId});
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createVolume(stack: Array<any>) {
        let self = this,
            objectType = Model.VmVolume,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.vmRepository.getNewVmVolume(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vmvolume, uiDescriptor) {
            context.object = vmvolume;
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public listDatastores(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDatastore,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-datastore'
            };
        return Promise.all([
            this.vmDatastoreRepository.list(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(datastores, uiDescriptor) {
            (datastores as any)._objectType = objectType;
            context.object = datastores;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getDatastore(datastoreId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmDatastore,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-datastore/_/' + encodeURIComponent(datastoreId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {id: datastoreId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public selectNewDatastoreType(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDatastore,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                isCreatePrevented: true,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            Promise.all(_.map(_.values(this.vmRepository.DATASTORE_TYPE), (type) => this.vmDatastoreRepository.getNewVmDatastoreForType(type))),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vmdatastores: Array<any>, uiDescriptor) {
            context.object = _.compact(vmdatastores);
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createDatastore(datastoreType: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmDatastore,
            columnIndex = 2,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + encodeURIComponent(datastoreType)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {_tmpId: datastoreType});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public listClones(vmId: string, stack: Array<any>) {
        let objectType = Model.VmClone,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/clones'
            };
        return Promise.all([
            this.vmRepository.listVms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((vms: Array<any>, uiDescriptor) => {
            let clones = _.sortBy(_.filter(vms, {parent: vmId}), 'name');
            (clones as any)._objectType = objectType;
            context.object = clones;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = this.eventDispatcherService.addEventListener(ModelEventName.Vm.listChange, (state) => {
                this.dataObjectChangeService.handleDataChange(clones, state);
                for (let i = clones.length - 1; i >= 0; i--) {
                    if (clones[i].parent !== vmId) {
                        clones.splice(i, 1);
                    }
                }
            });

            return this.updateStackWithContext(stack, context);
        });
    }

    public getClone(cloneId: string, stack: Array<any>) {
        let columnIndex = 3;
        return this.getVmWithIdAtColumnIndex(stack[columnIndex - 1].object, cloneId, stack, columnIndex);
    }

    public createClone(vmId: string, stack: Array<any>) {
        let objectType = Model.VmClone,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.vmRepository.getNewVmClone(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((clone, uiDescriptor) => {
            context.object = _.assign(clone, {parent: vmId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    private getVmWithIdAtColumnIndex(vms: Array<any>, vmId: string, stack: Array<any>, columnIndex: number) {
        let self = this,
            objectType = Model.Vm,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm/_/' + encodeURIComponent(vmId)
            };
        return Promise.all([
            this.vmRepository.listVms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (allVms: Array<any>, uiDescriptor) {
            context.object = _.find(vms, {id: vmId});
            context.userInterfaceDescriptor = uiDescriptor;
            context.object._parent = _.find(allVms, {id: context.object.parent});

            return self.updateStackWithContext(stack, context);
        });
    }
}
