import Promise = require("bluebird");
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";

import sectionsDescriptors  = require("core/model/sections-descriptors.json");

export class CalendarRoute {
    private static instance: CalendarRoute;
    private calendarService: any;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        private eventDispatcherService: EventDispatcherService) {
    }

    public static getInstance() {
        if (!CalendarRoute.instance) {
            CalendarRoute.instance = new CalendarRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance()
            );
        }
        return CalendarRoute.instance;
    }

    public get() {
        let self = this,
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
                    self.modelDescriptorService.getUiDescriptorForType('Calendar')
                ];
            }).spread(function(service, uiDescriptor) {
                let stack = [
                    {
                        object: service.entries[0],
                        userInterfaceDescriptor: uiDescriptor,
                        columnIndex: 0,
                        objectType: 'Calendar',
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
}
