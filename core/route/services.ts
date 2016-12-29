import _ = require("lodash");
import Promise = require("bluebird");
import {ModelEventName} from "../model-event-name";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {ServiceRepository} from "../repository/service-repository";
import {AbstractRoute} from "./abstract-route";

export class ServicesRoute extends AbstractRoute {
    private static instance: ServicesRoute;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService,
                        private serviceRepository: ServiceRepository) {
        super(eventDispatcherService);
    }

    public static getInstance() {
        if (!ServicesRoute.instance) {
            ServicesRoute.instance = new ServicesRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                ServiceRepository.getInstance()
            );
        }
        return ServicesRoute.instance;
    }

    public getCategory(categoryId: string, stack: Array<any>) {
        let self = this,
            objectType = 'ServicesCategory',
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/services-category/_/' + categoryId
            };
        return Promise.all([
            this.serviceRepository.listServicesCategories(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(categories, uiDescriptor) {
            context.object = _.find(categories, {id: categoryId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getService(serviceId: string, stack: Array<any>) {
        let self = this,
            objectType = 'Service',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/services-category/_/' + serviceId
            };
        return Promise.all([
            this.serviceRepository.listServices(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(services, uiDescriptor) {
            context.object = _.find(services, {id: serviceId});
            context.userInterfaceDescriptor = uiDescriptor;
            return Promise.resolve(context.object.config);
        }).then(function() {
            return self.updateStackWithContext(stack, context);
        });
    }
}
