import Promise = require("bluebird");
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";

import sectionsDescriptors  = require("../../data/sections-descriptors.json");
import {CalendarRepository} from "../repository/calendar-repository";
import _ = require("lodash");
import {ModelEventName} from "../model-event-name";
import {AbstractRoute} from "./abstract-route";
import {Model} from "../model";

export class CalendarRoute extends AbstractRoute {
    private static instance: CalendarRoute;
    private calendarService: any;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService,
                        private calendarRepository: CalendarRepository) {
        super(eventDispatcherService);
    }

    public static getInstance() {
        if (!CalendarRoute.instance) {
            CalendarRoute.instance = new CalendarRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                CalendarRepository.getInstance()
            );
        }
        return CalendarRoute.instance;
    }

    public get() {
        let self = this,
            objectType = Model.Calendar,
            sectionDescriptor = sectionsDescriptors.calendar,
            servicePromise;
        if (this.calendarService) {
            servicePromise = Promise.resolve(this.calendarService);
        } else {
            servicePromise = Promise.resolve().then(function() {
                return require.async(sectionDescriptor.service)
            }).then(function(module) {
                let exports = Object.keys(module);
                if (exports.length === 1) {
                    let clazz = module[exports[0]],
                        instance = clazz.instance || new clazz(),
                        instancePromise = instance.instanciationPromise;
                    self.calendarService = instance;
                    return instancePromise;
                }
            }).then(function(service) {
                service.sectionGeneration = 'new';
                service.section.id = sectionDescriptor.id;
                service.section.settings.id = sectionDescriptor.id;
                service.section.label = sectionDescriptor.label;
                service.section.icon = sectionDescriptor.icon;
                return service;
            });
        }
        if (Promise.is(servicePromise)) {
            return servicePromise.then(function(service) {
                return [
                    service,
                    self.modelDescriptorService.getUiDescriptorForType(objectType)
                ];
            }).spread(function(service, uiDescriptor) {
                let stack = [
                    {
                        object: service.entries[0],
                        userInterfaceDescriptor: uiDescriptor,
                        columnIndex: 0,
                        objectType: objectType,
                        path: '/' + sectionDescriptor.id
                    }
                ];

                self.eventDispatcherService.dispatch('sectionChange', service);
                self.eventDispatcherService.dispatch('pathChange', stack);
                return stack;
            }, function(error) {
                console.warn(error.message);
            });
        }

    }

    public getTask(calendarTaskId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.CalendarTask,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/calendar-task/_/' + encodeURIComponent(calendarTaskId)
            };
        return Promise.all([
            this.calendarRepository.listTasks(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(calendarTasks: Array<any>, uiDescriptor) {
            context.object = _.find(calendarTasks, {id: calendarTaskId});
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

    public createTask(taskType: any, stack: Array<any>) {
        let self = this,
            objectType = Model.CalendarTask,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/calendar-task/create/' + encodeURIComponent(taskType)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = parentContext.object._newTask;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }
}
