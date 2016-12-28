"use strict";
var Promise = require("bluebird");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var sectionsDescriptors = require("core/model/sections-descriptors.json");
var CalendarRoute = (function () {
    function CalendarRoute(modelDescriptorService, eventDispatcherService) {
        this.modelDescriptorService = modelDescriptorService;
        this.eventDispatcherService = eventDispatcherService;
    }
    CalendarRoute.getInstance = function () {
        if (!CalendarRoute.instance) {
            CalendarRoute.instance = new CalendarRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance());
        }
        return CalendarRoute.instance;
    };
    CalendarRoute.prototype.get = function () {
        var self = this, sectionDescriptor = sectionsDescriptors.calendar, servicePromise;
        if (this.calendarService) {
            servicePromise = Promise.resolve(this.calendarService);
        }
        else {
            servicePromise = Promise.resolve().then(function () {
                return require.async(sectionDescriptor.service);
            }).then(function (module) {
                var exports = Object.keys(module);
                if (exports.length === 1) {
                    var clazz = module[exports[0]], instance = clazz.instance || new clazz(), instancePromise = instance.instanciationPromise;
                    self.calendarService = instance;
                    return instancePromise;
                }
            }).then(function (service) {
                service.sectionGeneration = 'new';
                service.section.id = sectionDescriptor.id;
                service.section.settings.id = sectionDescriptor.id;
                service.section.label = sectionDescriptor.label;
                service.section.icon = sectionDescriptor.icon;
                return service;
            });
        }
        if (Promise.is(servicePromise)) {
            return servicePromise.then(function (service) {
                return [
                    service,
                    self.modelDescriptorService.getUiDescriptorForType('Calendar')
                ];
            }).spread(function (service, uiDescriptor) {
                var stack = [
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
            }, function (error) {
                console.warn(error.message);
            });
        }
    };
    return CalendarRoute;
}());
exports.CalendarRoute = CalendarRoute;
