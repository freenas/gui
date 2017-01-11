// DTM
declare let require: any;
import {EventDispatcherService} from '../service/event-dispatcher-service';
import {ModelDescriptorService} from '../service/model-descriptor-service';

import {AbstractRoute} from './abstract-route';
import {Model} from '../model';
import * as Promise from 'bluebird';

export class SectionRoute extends AbstractRoute {
    private static instance: SectionRoute;
    private sectionsServices: Map<string, any>;
    private sectionsDescriptorsPromise: Promise<any>;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService) {
        super(eventDispatcherService);
        this.sectionsServices = new Map<string, any>();
    }

    public static getInstance() {
        if (!SectionRoute.instance) {
            SectionRoute.instance = new SectionRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance()
            );
        }
        return SectionRoute.instance;
    }

    public get(sectionId: string): Promise<Array<any>> {
        let self = this,
            objectType = Model.Section,
            sectionDescriptor;
        return this.loadSectionsDescriptors().then((sectionsDescriptors) => {
            sectionDescriptor = sectionsDescriptors[sectionId];
            return Promise.resolve(
                this.sectionsServices.has(sectionDescriptor.id) ?
                    this.sectionsServices.get(sectionDescriptor.id) :
                    require.async(sectionDescriptor.service).then(function(module) {
                        let exports = Object.keys(module);
                        if (exports.length === 1) {
                            let clazz = module[exports[0]],
                                instance = clazz.instance || new clazz(),
                                instancePromise = instance.instanciationPromise;
                            self.sectionsServices.set(sectionDescriptor.id, instance);
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

    public getSettings(sectionId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.SectionSettings,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/section-settings/_/' + encodeURIComponent(sectionId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((uiDescriptor) => {
            context.object = parentContext.object.settings;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    private loadSectionsDescriptors(): Promise<any> {
        if (!this.sectionsDescriptorsPromise) {
            this.sectionsDescriptorsPromise = Promise.resolve(SystemJS.import('data/sections-descriptors.json'));
        }
        return this.sectionsDescriptorsPromise;
    }
}
