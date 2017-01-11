import * as _ from 'lodash';
import * as Promise from 'bluebird';
import {EventDispatcherService} from '../service/event-dispatcher-service';
import {ModelDescriptorService} from '../service/model-descriptor-service';
import {NetworkRepository} from '../repository/network-repository';
import {AbstractRoute} from './abstract-route';
import {Model} from '../model';

export class NetworkRoute extends AbstractRoute {
    private static instance: NetworkRoute;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService,
                        private networkRepository: NetworkRepository) {
        super(eventDispatcherService);
    }

    public static getInstance() {
        if (!NetworkRoute.instance) {
            NetworkRoute.instance = new NetworkRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                NetworkRepository.getInstance()
            );
        }
        return NetworkRoute.instance;
    }

    public get(interfaceId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.NetworkInterface,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/network-interface/_/' + encodeURIComponent(interfaceId)
            };
        return Promise.all([
            this.networkRepository.listNetworkInterfaces(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(interfaces, uiDescriptor) {
            context.object = _.find(interfaces, {id: interfaceId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public selectNewInterfaceType(stack: Array<any>) {
        let self = this,
            objectType = Model.NetworkInterface,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                isCreatePrevented: true,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            Promise.map(_.values(NetworkRepository.INTERFACE_TYPES), type => this.networkRepository.getNewInterfaceWithType(type)),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(interfaces: any, uiDescriptor) {
            interfaces._objectType = objectType;
            context.object = _.compact(interfaces);
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public create(interfaceType: string, stack: Array<any>) {
        let self = this,
            objectType = Model.NetworkInterface,
            columnIndex = 1,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + interfaceType
            };
        return this.modelDescriptorService.getUiDescriptorForType(objectType)
            .then(function(uiDescriptor) {
                context.userInterfaceDescriptor = uiDescriptor;
                context.object = _.find(parentContext.object, {_tmpId: interfaceType});

                return self.updateStackWithContext(stack, context);
            });
    }

    public listIpmi(stack: Array<any>) {
        let self = this,
            objectType = Model.Ipmi,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/ipmi'
            };
        return Promise.all([
            this.networkRepository.listIpmiChannels(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(ipmi: any, uiDescriptor) {
            ipmi._objectType = objectType;
            context.object = ipmi;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getIpmi(ipmiId: string, stack: Array<any>) {
       let self = this,
            objectType = Model.Ipmi,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/ipmi/_/' + encodeURIComponent(ipmiId)
            };
        return Promise.all([
            this.networkRepository.listIpmiChannels(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(ipmi, uiDescriptor) {
            context.object = _.find(ipmi, {id: +ipmiId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }
}
