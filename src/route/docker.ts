import * as _ from 'lodash';
import * as Promise from 'bluebird';
import {EventDispatcherService} from '../service/event-dispatcher-service';
import {ModelDescriptorService} from '../service/model-descriptor-service';
import {ContainerRepository} from '../repository/container-repository';
import {AbstractRoute} from './abstract-route';
import {Model} from '../model';
import {ModelEventName} from '../model-event-name';
import {DataObjectChangeService} from '../service/data-object-change-service';

export class DockerRoute extends AbstractRoute {
    private static instance: DockerRoute;

     private constructor(private modelDescriptorService: ModelDescriptorService,
                         eventDispatcherService: EventDispatcherService,
                         private dataObjectChangeService: DataObjectChangeService,
                         private dockerRepository: ContainerRepository) {
        super(eventDispatcherService);
    }

    public static getInstance() {
        if (!DockerRoute.instance) {
            DockerRoute.instance = new DockerRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                new DataObjectChangeService(),
                ContainerRepository.instance
            );
        }
        return DockerRoute.instance;
    }

    public listHosts(stack: Array<any>) {
        let self = this,
            objectType = Model.DockerHost,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-host'
            };
        return Promise.all([
            this.dockerRepository.listDockerHosts(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((hosts: any, uiDescriptor) => {
            context.object = hosts;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(hosts, state);
            });

            return this.updateStackWithContext(stack, context);
        });
    }

    public getHost(hostId, stack: Array<any>) {
        let objectType = Model.DockerHost,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + hostId
            };
        return Promise.all([
            this.dockerRepository.listDockerHosts(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((hosts: any, uiDescriptor) => {
            context.object = _.find(hosts, {id: hostId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public listImages(stack: Array<any>) {
        let self = this,
            objectType = Model.DockerImage,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-image'
            };
        return Promise.all([
            this.dockerRepository.listDockerImages(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images: any, uiDescriptor) => {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(images, state);
            });

            return this.updateStackWithContext(stack, context);
        });
    }

    public getImage(imageId, stack: Array<any>) {
        let objectType = Model.DockerImage,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + imageId
            };
        return Promise.all([
            this.dockerRepository.listDockerImages(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images: any, uiDescriptor) => {
            context.object = _.find(images, {id: imageId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public pullImage (collectionId, stack: Array<any>) {
        let objectType = Model.DockerImagePull,
            columnIndex = 2,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path
            };
        return Promise.all([
            this.dockerRepository.getNewDockerImage(),
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((image: any, collections, uiDescriptor) => {
            image.dockerCollection = _.find(collections, {id: collectionId});
            image._isNewObject = true;

            context.userInterfaceDescriptor = uiDescriptor;
            context.object = image;

            return this.updateStackWithContext(stack, context);
        });
    }

    public listCollections(stack: Array<any>) {
        let self = this,
            objectType = Model.DockerCollection,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-collection'
            };
        return Promise.all([
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images: any, uiDescriptor) => {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(images, state);
            });

            return this.updateStackWithContext(stack, context);
        });
    }

    public getCollection(collectionId, stack: Array<any>) {
        let objectType = Model.DockerCollection,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + collectionId
            };
        return Promise.all([
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((collections: any, uiDescriptor) => {
            context.object = _.find(collections, {id: collectionId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public listContainers(stack: Array<any>) {
        let self = this,
            objectType = Model.DockerContainer,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-container'
            };
        return Promise.all([
            this.dockerRepository.listDockerContainers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((containers: any, uiDescriptor) => {
            context.object = containers;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function(state) {
                self.dataObjectChangeService.handleDataChange(containers, state);
            });

            return this.updateStackWithContext(stack, context);
        });
    }

    public getContainer(containerId, stack: Array<any>) {
        let objectType = Model.DockerContainer,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + containerId
            };

        return Promise.all([
            this.dockerRepository.listDockerContainers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((containers: any, uiDescriptor) => {
            context.object = _.find(containers, {id: containerId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public getSettings (stack: Array<any>) {
        // todo
    }

    public listCollectionsForCreate(stack: Array<any>) {
        let objectType = Model.DockerCollection,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create',
                isCreatePrevented: true
            };

        return Promise.all([
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((collections, uiDescriptor) => {
            context.object = collections;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public createCollection(stack: Array<any>) {
        let objectType = Model.DockerCollection,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.dockerRepository.getNewDockerCollection(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((collection, uiDescriptor) => {
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = collection;

            return this.updateStackWithContext(stack, context);
        });

    }

    public createContainer(collectionId, stack: Array<any>) {
        let objectType = Model.DockerContainerCreator,
            columnIndex = 2,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path
            };
        return Promise.all([
            this.dockerRepository.getNewDockerContainer(),
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((container: any, collections, uiDescriptor) => {
            container.dockerCollection = _.find(collections, {id: collectionId});
            container._isNewObject = true;

            context.userInterfaceDescriptor = uiDescriptor;
            context.object = container;

            return this.updateStackWithContext(stack, context);
        });
    }
}
