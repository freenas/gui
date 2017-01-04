import {ModelDescriptorService} from "../service/model-descriptor-service";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {VmRepository} from '../repository/vm-repository';
import {AbstractRoute} from "./abstract-route";
import _ = require("lodash");
import Promise = require("bluebird");
import {Model} from "../model";

export class VmsRoute extends AbstractRoute {
    private static instance: VmsRoute;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService,
                        private vmRepository: VmRepository) {
        super(eventDispatcherService);
    }

    public static getInstance() {
        if (!VmsRoute.instance) {
            VmsRoute.instance = new VmsRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                VmRepository.instance
            );
        }
        return VmsRoute.instance;
    }

    public get(vmId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Vm,
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm/_/' + encodeURIComponent(vmId)
            };
        return Promise.all([
            this.vmRepository.listVms(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vms, uiDescriptor) {
            context.object = _.find(vms, {id: vmId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public create(stack: Array<any>) {
        let self = this,
            objectType = Model.Vm,
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
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
            parentContext = stack[columnIndex-1],
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

    public getDevices(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/devices'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.forEach(parentContext.object._nonVolumeDevices, (device) => device._objectType = objectType);
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getDevice(deviceId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
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
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public selectNewDeviceType(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                isCreatePrevented: true,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            Promise.all(_.map(_.values(this.vmRepository.DEVICE_TYPE), (type) => this.vmRepository.getNewVmDeviceForType(type))),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vmdevices, uiDescriptor) {
            context.object = _.compact(vmdevices);
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
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getVolumes(stack: Array<any>) {
        let self = this,
            objectType = Model.VmVolume,
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/volumes'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.forEach(parentContext.object._volumeDevices, (device) => device._objectType = objectType);
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getVolume(volumeId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmVolume,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
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
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createVolume(stack: Array<any>) {
        let self = this,
            objectType = Model.VmVolume,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
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
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

}
