import * as _ from 'lodash';
import * as uuid from 'uuid';
import {AbstractRoute, Route} from './abstract-route';
import {Model} from '../model';
import {VmRepository} from '../repository/vm-repository';
import {ModelEventName} from '../model-event-name';
import {VmDatastoreRepository} from '../repository/VmDatastoreRepository';
import {VmSnapshotRepository} from '../repository/VmSnapshotRepository';

export class VmsRoute extends AbstractRoute {
    private static instance: VmsRoute;

    private constructor(
        private vmRepository: VmRepository,
        private vmDatastoreRepository: VmDatastoreRepository,
        private vmSnapshotRepository: VmSnapshotRepository
    ) {
        super();
    }

    public static getInstance() {
        if (!VmsRoute.instance) {
            VmsRoute.instance = new VmsRoute(
                VmRepository.getInstance(),
                VmDatastoreRepository.getInstance(),
                VmSnapshotRepository.getInstance()
            );
        }
        return VmsRoute.instance;
    }

    @Route('/vms')
    public loadSection() {
        this.enterSection('vms');
    }

    @Route('/vms/settings')
    public getSettings() {
        this.loadSettings('vms')
    }

    @Route('/vms/vm/_/{vmId}')
    public getVm(vmId: string) {
        let columnIndex = 1;
        return this.getVmWithIdAtColumnIndex(vmId, columnIndex);
    }

    @Route('/vms/create')
    public createVm() {
        let self = this,
            objectType = Model.Vm,
            columnIndex = 1,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.vmRepository.getNewVm(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((vm, uiDescriptor) => {
            context.object = vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/create/readme')
    @Route('/vms/vm/_/{vmId}/readme')
    public getReadme() {
        let objectType = Model.VmReadme,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/readme'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            context.object = parentContext.object._readme;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/create/devices')
    @Route('/vms/vm/_/{vmId}/devices')
    public listDevices() {
        let objectType = Model.VmDevice,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/devices'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            context.object = _.map(
                _.reject(parentContext.object.devices, {type: this.vmRepository.DEVICE_TYPE.VOLUME}),
                device => _.assign(device, {
                    _objectType: Model.VmDevice,
                    _vm: parentContext.object,
                    id: uuid.v4()
                })
            );
            context.object._vm = parentContext.object;
            context.object._objectType = Model.VmDevice;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/create/devices/vm-device/_/{deviceId}')
    @Route('/vms/vm/_/{vmId}/devices/vm-device/_/{deviceId}')
    public getDevice(vmId: string, deviceId?: string) {
        deviceId = deviceId || vmId;
        let objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-device/_/' + encodeURIComponent(deviceId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            context.object = _.find(parentContext.object, {id: deviceId});
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/create/devices/create')
    @Route('/vms/vm/_/{vmId}/devices/create')
    public selectNewDeviceType() {
        let objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
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
        ]).spread((newVmDevices: Array<any>, uiDescriptor) => {
            let vm = parentContext.object._vm;
            context.object = _.compact(newVmDevices);
            context.object._vm = vm;
            parentContext.object = _.map(
                _.reject(vm.devices, {type: this.vmRepository.DEVICE_TYPE.VOLUME}),
                device => _.assign(device, {
                    _objectType: objectType,
                    _vm: vm,
                    id: uuid.v4()
                })
            );
            parentContext.object._vm = vm;
            parentContext.object._objectType = objectType;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/create/devices/create/{type}')
    @Route('/vms/vm/_/{vmId}/devices/create/{type}')
    public createDevice(vmId: string, deviceType?: string) {
        deviceType = deviceType || vmId;
        let objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = this.stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + encodeURIComponent(deviceType)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            context.object = _.find(parentContext.object, {_tmpId: deviceType});
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/vm/_/{vmId}/volumes')
    @Route('/vms/create/volumes')
    public listVolumes() {
        let objectType = Model.VmVolume,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/volumes'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            let vm = parentContext.object._vm;
            context.object = _.map(_.reject(
                    _.filter(parentContext.object.devices, {type: this.vmRepository.DEVICE_TYPE.VOLUME}),
                    {properties: {type: 'NFS'}}
                ),
                volume => _.assign(volume, {
                    _objectType: objectType,
                    _vm: vm,
                    id: uuid.v4()
                })
            );
            context.object._vm = parentContext.object;
            context.object._objectType = objectType;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/vm/_/{vmId}/volumes/vm-volume/_/{volumeId}')
    @Route('/vms/create/volumes/vm-volume/_/{volumeId}')
    public getVolume(vmId: string, volumeId?: string, ) {
        volumeId = volumeId || vmId;
        let objectType = Model.VmVolume,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-volume/_/' + encodeURIComponent(volumeId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            context.object = _.find(parentContext.object, {id: volumeId});
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/vm/_/{vmId}/volumes/create')
    @Route('/vms/create/volumes/create')
    public createVolume() {
        let objectType = Model.VmVolume,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.vmRepository.getNewVmVolume(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((vmvolume, uiDescriptor) => {
            context.object = vmvolume;
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/vm-datastore')
    public listDatastores() {
        let columnIndex = 1;
        return this.loadListInColumn(
            this.stack,
            columnIndex,
            columnIndex - 1,
            '/vm-datastore',
            Model.VmDatastore,
            this.vmDatastoreRepository.list()
        );

/*
        let objectType = Model.VmDatastore,
            columnIndex = 1,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-datastore'
            };
        return Promise.all([
            this.vmDatastoreRepository.list(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((datastores, uiDescriptor) => {
            (datastores as any)._objectType = objectType;
            context.object = datastores;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
*/
    }

    @Route('/vms/vm-datastore/_/{datastoreId}')
    public getDatastore(datastoreId: string, ) {
        let objectType = Model.VmDatastore,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-datastore/_/' + encodeURIComponent(datastoreId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            context.object = _.find(parentContext.object, {id: datastoreId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/vm-datastore/create')
    public selectNewDatastoreType() {
        let objectType = Model.VmDatastore,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                isCreatePrevented: true,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            Promise.all(_.map(_.values(this.vmRepository.DATASTORE_TYPE), (type: string) => this.vmDatastoreRepository.getNewVmDatastoreForType(type))),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((vmdatastores: Array<any>, uiDescriptor) => {
            context.object = _.compact(vmdatastores);
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/vm-datastore/create/{type}')
    public createDatastore(datastoreType: string, ) {
        let objectType = Model.VmDatastore,
            columnIndex = 2,
            parentContext = this.stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + encodeURIComponent(datastoreType)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            context.object = _.find(parentContext.object, {_tmpId: datastoreType});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/vm/_/{vmId}/clones')
    public listClones(vmId: string, ) {
        let objectType = Model.VmClone,
            columnIndex = 2,
            parentContext = this.stack[columnIndex - 1],
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

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/vm/_/{vmId}/clones/vm/_/{cloneId}')
    public getClone(cloneId: string, ) {
        let columnIndex = 3;
        return this.getVmWithIdAtColumnIndex(cloneId, columnIndex);
    }

    @Route('/vms/vm/_/{vmId}/clones/create')
    public createClone(vmId: string, ) {
        let objectType = Model.VmClone,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
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

            return this.updateStackWithContext(this.stack, context);
        });
    }

    @Route('/vms/vm/_/{vmId}/snapshots')
    public listSnapshots(vmId: string, ) {
        let columnIndex = 2,
            parentContext = this.stack[columnIndex - 1];
        return this.loadListInColumn(
            this.stack,
            columnIndex,
            columnIndex - 1,
            '/snapshots',
            Model.VmSnapshot,
            this.vmSnapshotRepository.list(),
            {
                filter: { parent: {id: vmId}},
                sort: 'name'
            }
        );
    }

    @Route('/vms/vm/_/{vmId}/snapshots/vm-snapshot/_/{snapshotId}')
    public getSnapshot(vmId: string, snapshotId: string, ) {
        let columnIndex = 3;
        return this.loadObjectInColumn(
            this.stack,
            columnIndex,
            columnIndex - 1,
            AbstractRoute.getObjectPathSuffix(Model.VmSnapshot, snapshotId),
            Model.VmSnapshot,
            this.vmSnapshotRepository.list(),
            {id: snapshotId}
        );
    }

    @Route('/vms/vm/_/{vmId}/snapshots/create')
    public createSnapshot(vmId: string, ) {
        let objectType = Model.VmSnapshot,
            columnIndex = 3,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.vmSnapshotRepository.getNewVmSnapshot(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((snapshot, uiDescriptor) => {
            context.object = _.assign(snapshot, {parent: vmId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }

    private getVmWithIdAtColumnIndex(vmId: string, columnIndex: number) {
        let objectType = Model.Vm,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm/_/' + encodeURIComponent(vmId)
            };
        return Promise.all([
            this.vmRepository.listVms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((allVms: Array<any>, uiDescriptor) => {
            context.object = _.find(allVms, {id: vmId});
            context.object._parent = _.find(allVms, {id: context.object.parent});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(this.stack, context);
        });
    }
}
