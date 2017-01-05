"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var abstract_route_1 = require("./abstract-route");
var model_1 = require("../model");
var Promise = require("bluebird");
var SectionRoute = (function (_super) {
    __extends(SectionRoute, _super);
    function SectionRoute(modelDescriptorService, eventDispatcherService) {
        var _this = _super.call(this, eventDispatcherService) || this;
        _this.modelDescriptorService = modelDescriptorService;
        _this.sectionsServices = new Map();
        return _this;
    }
    SectionRoute.getInstance = function () {
        if (!SectionRoute.instance) {
            SectionRoute.instance = new SectionRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance());
        }
        return SectionRoute.instance;
    };
    SectionRoute.prototype.get = function (sectionId) {
        var _this = this;
        var self = this, objectType = model_1.Model.Section, sectionDescriptor;
        return this.loadSectionsDescriptors().then(function (sectionsDescriptors) {
            sectionDescriptor = sectionsDescriptors[sectionId];
            return Promise.resolve(_this.sectionsServices.has(sectionDescriptor.id) ?
                _this.sectionsServices.get(sectionDescriptor.id) :
                require.async(sectionDescriptor.service).then(function (module) {
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
                }));
        }).then(function (service) {
            return Promise.all([
                service,
                self.modelDescriptorService.getUiDescriptorForType(objectType)
            ]).spread(function (service, uiDescriptor) {
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
            }).caught(function (error) {
                console.warn(error.message);
            });
        });
    };
    SectionRoute.prototype.getOld = function (sectionId) {
        this.eventDispatcherService.dispatch('oldSectionChange', sectionId);
    };
    SectionRoute.prototype.getSettings = function (sectionId, stack) {
        var self = this, objectType = model_1.Model.SectionSettings, columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/section-settings/_/' + encodeURIComponent(sectionId)
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            context.object = parentContext.object.settings;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    SectionRoute.prototype.loadSectionsDescriptors = function () {
        if (!this.sectionsDescriptorsPromise) {
            this.sectionsDescriptorsPromise = Promise.resolve(SystemJS.import('data/sections-descriptors.json'));
        }
        return this.sectionsDescriptorsPromise;
    };
    return SectionRoute;
}(abstract_route_1.AbstractRoute));
exports.SectionRoute = SectionRoute;
