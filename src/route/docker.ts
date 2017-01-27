import * as _ from 'lodash';
import {AbstractRoute} from './abstract-route';
import {Model} from '../model';
import {ModelEventName} from '../model-event-name';
import {DockerHostRepository} from '../repository/docker-host-repository-ng';
import {DockerImageReadmeRepository} from '../repository/docker-image-readme-repository';
import {DockerImageRepository} from '../repository/docker-image-repository-ng';
import {DockerCollectionRepository} from '../repository/docker-collection-repository-ng';
import {DockerContainerRepository} from '../repository/docker-container-repository-ng';
import {DockerNetworkRepository} from '../repository/docker-network-repository';
import {DockerContainerLogsRepository} from '../repository/docker-container-logs-repository';

export class DockerRoute extends AbstractRoute {
    private static instance: DockerRoute;

    private constructor(private dockerHostRepository: DockerHostRepository,
                        private dockerImageRepository: DockerImageRepository,
                        private dockerCollectionRepository: DockerCollectionRepository,
                        private dockerContainerRepository: DockerContainerRepository,
                        private dockerNetworkRepository: DockerNetworkRepository,
                        private dockerContainerLogsRepository: DockerContainerLogsRepository,
                        private dockerImageReadmeRepository: DockerImageReadmeRepository) {
        super();
    }

    public static getInstance() {
        if (!DockerRoute.instance) {
            DockerRoute.instance = new DockerRoute(
                DockerHostRepository.getInstance(),
                DockerImageRepository.getInstance(),
                DockerCollectionRepository.getInstance(),
                DockerContainerRepository.getInstance(),
                DockerNetworkRepository.getInstance(),
                DockerContainerLogsRepository.getInstance(),
                DockerImageReadmeRepository.getInstance()
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
            this.dockerHostRepository.listDockerHosts(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((hosts: any, uiDescriptor) => {
            context.object = hosts;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function (state) {
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
            this.dockerHostRepository.listDockerHosts(),
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
            this.dockerImageRepository.listDockerImages(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images: any, uiDescriptor) => {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function (state) {
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
            this.dockerImageRepository.listDockerImages(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images: any, uiDescriptor) => {
            context.object = _.find(images, {id: imageId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public pullImage(collectionId, stack: Array<any>) {
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
            this.dockerImageRepository.getNewDockerImage(),
            this.dockerCollectionRepository.listDockerCollections(),
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
            this.dockerCollectionRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((images: any, uiDescriptor) => {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function (state) {
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
            this.dockerCollectionRepository.listDockerCollections(),
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
            this.dockerContainerRepository.listDockerContainers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((containers: any, uiDescriptor) => {
            context.object = containers;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = self.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, function (state) {
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
            this.dockerContainerRepository.listDockerContainers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((containers: any, uiDescriptor) => {
            context.object = _.find(containers, {id: containerId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public getSettings() {
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
            this.dockerCollectionRepository.listDockerCollections(),
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
            this.dockerCollectionRepository.getNewDockerCollection(),
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
                path: parentContext.path + '/' + collectionId
            };
        return Promise.all([
            this.dockerContainerRepository.getNewDockerContainer(),
            this.dockerCollectionRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((container: any, collections, uiDescriptor) => {
            container.dockerCollection = _.find(collections, {id: collectionId});
            container._isNewObject = true;

            context.userInterfaceDescriptor = uiDescriptor;
            context.object = container;

            return this.updateStackWithContext(stack, context);
        });
    }

    public getReadme(stack: Array<any>) {
        let objectType = Model.DockerImageReadme,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            imageName = parentContext.object.image,
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/readme'
            };
        return Promise.all([
            this.dockerImageReadmeRepository.getDockerImageReadme(),
            this.dockerImageRepository.getReadmeForDockerImage(imageName),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((dockerImageReadme, readme, uiDescriptor) => {
            (dockerImageReadme as any).text = readme;
            context.object = dockerImageReadme;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public listDockerNetworks(stack: Array<any>) {
        let objectType = Model.DockerNetwork,
            columnIndex = 1,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-network'
            };
        return Promise.all([
            this.dockerNetworkRepository.listDockerNetworks(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((networks: Array<any>, uiDescriptor) => {
            context.object = networks;
            context.userInterfaceDescriptor = uiDescriptor;
            context.changeListener = this.eventDispatcherService.addEventListener(ModelEventName[objectType].listChange, (state) => {
                this.dataObjectChangeService.handleDataChange(networks, state);
            });

            return this.updateStackWithContext(stack, context);
        });
    }

    public getDockerNetwork(dockerNetworkId, stack: Array<any>) {
        let objectType = Model.DockerNetwork,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + dockerNetworkId
            };

        return Promise.all([
            this.dockerNetworkRepository.listDockerNetworks(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((networks: Array<any>, uiDescriptor) => {
            context.object = _.find(networks, {id: dockerNetworkId});
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public createDockerNetwork(stack: Array<any>) {
        let objectType = Model.DockerNetwork,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.dockerNetworkRepository.getNewDockerNetwork(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((dockerNetwork, uiDescriptor) => {
            (dockerNetwork as any)._isNewObject = true;
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = dockerNetwork;

            return this.updateStackWithContext(stack, context);
        });
    }

    public getContainerLogs(stack: Array<any>) {
        let objectType = Model.DockerContainerLogs,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/docker-container-logs'
            };

        return Promise.all([
            this.dockerContainerLogsRepository.getNewDockerContainerLogs(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((dockerContainerLogs, uiDescriptor) => {
            context.object = dockerContainerLogs;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

}
