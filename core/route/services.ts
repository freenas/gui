import _ = require("lodash");
import Promise = require("bluebird");
import {ModelEventName} from "../model-event-name";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {ServiceRepository} from "../repository/service-repository";
export class ServicesRoute {
    private static instance: ServicesRoute;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        private eventDispatcherService: EventDispatcherService,
                        private serviceRepository: ServiceRepository) {

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

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
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
            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }
}
