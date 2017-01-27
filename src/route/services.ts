import _ = require('lodash');
import {ServiceRepository} from '../repository/service-repository';
import {AbstractRoute} from './abstract-route';
import {Model} from '../model';

export class ServicesRoute extends AbstractRoute {
    private static instance: ServicesRoute;

    private constructor(private serviceRepository: ServiceRepository) {
        super();
    }

    public static getInstance() {
        if (!ServicesRoute.instance) {
            ServicesRoute.instance = new ServicesRoute(
                ServiceRepository.getInstance()
            );
        }
        return ServicesRoute.instance;
    }

    public getCategory(categoryId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.ServicesCategory,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/services-category/_/' + encodeURIComponent(categoryId)
            };
        return Promise.all([
            this.serviceRepository.listServicesCategories(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(categories: Array<any>, uiDescriptor) {
            context.object = _.find(categories, {id: categoryId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getService(serviceId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Service,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/service/_/' + encodeURIComponent(serviceId)
            };
        return Promise.all([
            this.serviceRepository.listServices(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(services: Array<any>, uiDescriptor) {
            context.object = _.find(services, {id: serviceId});
            context.userInterfaceDescriptor = uiDescriptor;
            return Promise.resolve(context.object.config);
        }).then(function() {
            return self.updateStackWithContext(stack, context);
        });
    }

    public listRsyncdModules(stack: Array<any>) {
        let self = this,
            objectType = Model.RsyncdModule,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/modules'
            };
        return Promise.all([
            this.serviceRepository.listRsyncdModules(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(rsyncdModules, uiDescriptor) {
            context.object = rsyncdModules;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createRsyncdModule(stack: Array<any>) {
        let self = this,
            objectType = Model.RsyncdModule,
            columnIndex = 4,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.serviceRepository.getNewRsyncdModule(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(rsyncdModule, uiDescriptor) {
            context.object = rsyncdModule;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public getRsyncdModule(rsyncdModuleId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.RsyncdModule,
            columnIndex = 4,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/modules/rsyncd-module/_/' + encodeURIComponent(rsyncdModuleId)
            };
        return Promise.all([
            this.serviceRepository.listRsyncdModules(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(rsyncdModules: Array<any>, uiDescriptor) {
            context.object = _.find(rsyncdModules, {id: rsyncdModuleId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }
}
