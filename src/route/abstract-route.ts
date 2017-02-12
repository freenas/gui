// DTM
declare let require: any;

import * as _ from 'lodash';
import * as crossroads from 'crossroads';
import {EventDispatcherService} from '../service/event-dispatcher-service';
import {ModelDescriptorService} from '../service/model-descriptor-service';
import {ModelEventName} from '../model-event-name';
import {DataObjectChangeService} from '../service/data-object-change-service';
import {Model} from '../model';

export abstract class AbstractRoute {
    protected stack: Array<any>;
    private static sectionsServices = new Map<string, any>();
    private static sectionsDescriptorsPromise: Promise<any>;

    protected constructor(
        protected eventDispatcherService: EventDispatcherService = EventDispatcherService.getInstance(),
        protected modelDescriptorService: ModelDescriptorService = ModelDescriptorService.getInstance(),
        protected dataObjectChangeService: DataObjectChangeService = new DataObjectChangeService()
    ) {}

    protected updateStackWithContext(stack: Array<any>, context: any) {
        this.popStackAtIndex(stack, context.columnIndex);
        stack.push(context);
        return stack;
    }

    protected loadObjectInColumn(stack: any, columnIndex: number, previousColumnIndex: number, pathSuffix: any, objectType: any, dataPromise: Promise<Array<any>>|Promise<any>, filter?: any): Promise<Array<any>> {
        let parentContext = stack[previousColumnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + pathSuffix
            };
        return Promise.all([
            dataPromise,
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((objects: Array<any>|any, uiDescriptor: Object) => {
            context.object = filter ? _.find(objects, filter) : objects;
            context.userInterfaceDescriptor = uiDescriptor;
            context.objectType = objectType;

            return this.updateStackWithContext(stack, context);
        });

    }

    protected loadPropertyInColumn(stack: any, columnIndex: number, previousColumnIndex: number, pathSuffix: any, objectType: any, propertyPath: string): Promise<Array<any>> {
        let parentContext = stack[previousColumnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + pathSuffix
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor: Object) => {
            context.object = _.get(parentContext.object, propertyPath);
            context.userInterfaceDescriptor = uiDescriptor;
            context.objectType = objectType;

            return this.updateStackWithContext(stack, context);
        });
    }

    protected loadListInColumn(stack: any, columnIndex: number, previousColumnIndex: number, pathSuffix: any, objectType: any, dataPromise: Promise<Array<any>>, options?: any): Promise<Array<any>> {
        options = options || {};
        let parentContext = stack[previousColumnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + pathSuffix
            };
        return Promise.all([
            dataPromise,
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((objects: Array<any>, uiDescriptor) => {
            let filteredObjects = _.sortBy(_.filter(objects, options.filter || _.identity), options.sort || 'id');
            context.objectType = (filteredObjects as any)._objectType = objectType;
            context.object = filteredObjects;
            context.userInterfaceDescriptor = uiDescriptor;

            context.changeListener = this.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, state =>
                this.dataObjectChangeService.handleDataChange(filteredObjects, state, options)
            );

            return this.updateStackWithContext(stack, context);
        });
    }

    protected static getObjectPathSuffix(model: any, id: string) {
        return '/' + _.kebabCase(model) + '/_/' + encodeURIComponent(_.toString(id));
    }

    private popStackAtIndex(stack: Array<any>, index: number) {
        while (stack.length > index) {
            let context = stack.pop();
            if (context) {
                this.unregisterChangeListeners(context.changeListener);
            }
        }
    }

    private unregisterChangeListeners(changeListeners: Array<Function>|Function) {
        if (changeListeners) {
            for (let listener of _.castArray(changeListeners)) {
                this.eventDispatcherService.removeEventListener((listener as any).eventName, listener);
            }
        }
    }

    public restore(stack: Array<any>) {
        this.stack = stack;
    }

    public saveState(): Array<any> {
        let stateSnapshot = [];
        _.forEach(this.stack, (value, index) => {
            let context = _.clone(value);
            if (index > 0) {
                context.parentcontext = stateSnapshot[index - 1];
            }
            stateSnapshot.push(context);
        });
        return stateSnapshot;
    }

    protected enterSection(sectionId: string) {
        let promise: Promise<Array<any>> = this.stack ?
            new Promise<Array<any>>(resolve => resolve(this.stack)) :
            this.getStackForSection(sectionId).then(stack => this.stack = stack);
        promise.then(stack => {
            this.eventDispatcherService.dispatch('sectionChange', stack[0].service);
            this.eventDispatcherService.dispatch('pathChange', stack);
        });
    }

    public getStackForSection(sectionId: string): Promise<Array<any>> {
        let self = this,
            objectType = Model.Section,
            sectionDescriptor;
        return this.loadSectionsDescriptors().then((sectionsDescriptors) => {
            sectionDescriptor = sectionsDescriptors[sectionId];
            return Promise.resolve(
                AbstractRoute.sectionsServices.has(sectionDescriptor.id) ?
                    AbstractRoute.sectionsServices.get(sectionDescriptor.id) :
                    require.async(sectionDescriptor.service).then(function(module) {
                        let exports = Object.keys(module);
                        if (exports.length === 1) {
                            let clazz = module[exports[0]],
                                instance = clazz.instance || new clazz(),
                                instancePromise = instance.instanciationPromise;
                            AbstractRoute.sectionsServices.set(sectionDescriptor.id, instance);
                            return instancePromise;
                        }
                    }).then(function(service) {
                        service.sectionGeneration = 'new';
                        service.section.id = sectionDescriptor.id;
                        service.section.settings.id = sectionDescriptor.id;
                        service.section.label = sectionDescriptor.label;
                        service.section.icon = sectionDescriptor.icon;
                        return service;
                    })
            );
        }).then((service) => {
            return Promise.all([
                service,
                self.modelDescriptorService.getUiDescriptorForType(objectType)
            ]).spread(function(service: any, uiDescriptor) {
                return [
                    {
                        object: service.section,
                        service: service,
                        userInterfaceDescriptor: uiDescriptor,
                        columnIndex: 0,
                        objectType: objectType,
                        path: '/' + encodeURIComponent(sectionDescriptor.id)
                    }
                ];
            }).caught(function(error) {
                console.warn(error.message);
            });
        });
    }

    public getOld(sectionId: string) {
        this.eventDispatcherService.dispatch('oldSectionChange', sectionId);
    }

    private loadSectionsDescriptors(): Promise<any> {
        if (!AbstractRoute.sectionsDescriptorsPromise) {
            AbstractRoute.sectionsDescriptorsPromise = Promise.resolve(SystemJS.import('data/sections-descriptors.json'));
        }
        return AbstractRoute.sectionsDescriptorsPromise;
    }

    public loadSettings(sectionId: string) {
        let self = this,
            objectType = Model.SectionSettings,
            columnIndex = 1,
            parentContext = this.stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/settings/_/' + encodeURIComponent(sectionId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            context.object = parentContext.object.settings;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(this.stack, context);
        });
    }

}

export function Route(path: string) {
    return function(target, propertyKey: string) {
        crossroads.addRoute(path, (...params) => target[propertyKey].apply(target.constructor.getInstance(), params));
    };
}
