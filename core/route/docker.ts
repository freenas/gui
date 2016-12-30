import _ = require("lodash");
import Promise = require("bluebird");
import {ModelEventName} from "../model-event-name";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {ContainerRepository} from "../repository/container-repository";

export class DockerRoute {
    private static instance: DockerRoute;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        private eventDispatcherService: EventDispatcherService,
                        private dockerRepository: ContainerRepository) {

    }

    public static getInstance() {
        if (!DockerRoute.instance) {
            DockerRoute.instance = new DockerRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                ContainerRepository.instance
            );
        }
        return DockerRoute.instance;
    }

    public listHosts(stack: Array<any>) {
        let objectType = 'DockerHost',
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-host'
            };
        return Promise.all([
            this.dockerRepository.listDockerHosts(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((hosts, uiDescriptor) => {
            context.object = hosts;
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public getHost(hostId, stack: Array<any>) {
        let objectType = 'DockerHost',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + hostId
            };
        return Promise.all([
            this.dockerRepository.listDockerHosts(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((hosts, uiDescriptor) => {
            context.object = _.find(hosts, {id: hostId});
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public listImages(stack: Array<any>) {
        let objectType = 'DockerImage',
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-image'
            };
        return Promise.all([
            this.dockerRepository.listDockerImages(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images, uiDescriptor) => {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public getImage(imageId, stack: Array<any>) {
        let objectType = 'DockerImage',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + imageId
            };
        return Promise.all([
            this.dockerRepository.listDockerImages(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images, uiDescriptor) => {
            context.object = _.find(images, {id: imageId});
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public pullImage (collectionId, stack: Array<any>) {
        let objectType = 'DockerImagePull',
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
        ]).spread((image, collections, uiDescriptor) => {
            let collection = _.find(collections, {id: collectionId});
            image.dockerCollection = collection;
            image._isNewObject = true;

            context.userInterfaceDescriptor = uiDescriptor;
            context.object = image;


            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public listCollections(stack: Array<any>) {
        let objectType = 'DockerCollection',
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-collection'
            };
        return Promise.all([
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images, uiDescriptor) => {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public getCollection(collectionId, stack: Array<any>) {
        let objectType = 'DockerCollection',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + collectionId
            };
        return Promise.all([
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((collections, uiDescriptor) => {
            context.object = _.find(collections, {id: collectionId});
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public listContainers(stack: Array<any>) {
        let objectType = 'DockerContainer',
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-container'
            };
        return Promise.all([
            this.dockerRepository.listDockerContainers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images, uiDescriptor) => {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public getContainer(containerId, stack: Array<any>) {
        let objectType = 'DockerContainer',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + containerId
            };
        return Promise.all([
            this.dockerRepository.listDockerContainers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((containers, uiDescriptor) => {
            context.object = _.find(containers, {id: containerId});
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public getSettings (stack:Array<any>) {
        //todo
    }

    public listCollectionsForCreate(stack:Array<any>) {
        let objectType = 'DockerCollection',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + "/create"
            };

        return Promise.all([
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((collections, uiDescriptor) => {
            context.object = collections;
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public createCollection(stack:Array<any>) {
        let objectType = 'DockerCollection',
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + "/create"
            };
        return Promise.all([
            this.dockerRepository.getNewDockerCollection(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((collection, uiDescriptor) => {
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = collection;


            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });

    }

    public createContainer(collectionId, stack:Array<any>) {
        let objectType = 'DockerContainerCreator',
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
        ]).spread((container, collections, uiDescriptor) => {
            let collection = _.find(collections, {id: collectionId});
            container.dockerCollection = collection;
            container._isNewObject = true;

            context.userInterfaceDescriptor = uiDescriptor;
            context.object = container;


            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    this.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }
}
