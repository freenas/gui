"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require("bluebird");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var sectionsDescriptors = require("core/model/sections-descriptors.json");
var abstract_route_1 = require("./abstract-route");
var SectionRoute = (function (_super) {
    __extends(SectionRoute, _super);
    function SectionRoute(modelDescriptorService, eventDispatcherService) {
        _super.call(this, eventDispatcherService);
        this.modelDescriptorService = modelDescriptorService;
        this.sectionsServices = new Map();
    }
    SectionRoute.getInstance = function () {
        if (!SectionRoute.instance) {
            SectionRoute.instance = new SectionRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance());
        }
        return SectionRoute.instance;
    };
    SectionRoute.prototype.get = function (sectionId) {
        var self = this, sectionDescriptor = sectionsDescriptors[sectionId], servicePromise;
        if (this.sectionsServices.has(sectionDescriptor.id)) {
            servicePromise = Promise.resolve(this.sectionsServices.get(sectionDescriptor.id));
        }
        else {
            servicePromise = Promise.resolve().then(function () {
                return require.async(sectionDescriptor.service);
            }).then(function (module) {
                var exports = Object.keys(module);
                if (exports.length === 1) {
                    var clazz = module[exports[0]], instance = clazz.instance || new clazz(), instancePromise = instance.instanciationPromise;
                    self.sectionsServices.set(sectionDescriptor.id, instance);
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
                    self.modelDescriptorService.getUiDescriptorForType('Section')
                ];
            }).spread(function (service, uiDescriptor) {
                var stack = [
                    {
                        object: service.section,
                        userInterfaceDescriptor: uiDescriptor,
                        columnIndex: 0,
                        objectType: 'Section',
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
    SectionRoute.prototype.getOld = function (sectionId) {
        this.eventDispatcherService.dispatch('oldSectionChange', sectionId);
    };
    return SectionRoute;
}(abstract_route_1.AbstractRoute));
exports.SectionRoute = SectionRoute;
