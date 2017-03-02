import * as _ from 'lodash';
import {AbstractRoute} from './abstract-route';
import {Model} from '../model';
import {ModelEventName} from '../model-event-name';
import {DockerHostRepository} from '../repository/docker-host-repository';
import {DockerImageReadmeRepository} from '../repository/docker-image-readme-repository';
import {DockerImageRepository} from '../repository/docker-image-repository';
import {DockerCollectionRepository} from '../repository/docker-collection-repository';
import {DockerContainerRepository} from '../repository/docker-container-repository';
import {DockerNetworkRepository} from '../repository/docker-network-repository';
import {DockerContainerLogsRepository} from '../repository/docker-container-logs-repository';
import {DockerContainer} from '../model/DockerContainer';
import {DockerHost} from '../model/DockerHost';
import {DockerNetwork} from '../model/DockerNetwork';
import {DockerCollection} from '../model/DockerCollection';

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

    public listDockerNetworks(hostId, stack: Array<any>) {
        let columnIndex = 3;
        return this.loadListInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/docker-network',
            DockerNetwork.getClassName(),
            this.dockerNetworkRepository.list(),
            {
                filter: {host: hostId}
            }
        );
    }

    public getDockerNetwork(dockerNetworkId: string, stack: Array<any>) {
        let columnIndex = 4;
        return Promise.all([
            this.loadObjectInColumn(
                stack,
                columnIndex,
                columnIndex - 1,
                '/create',
                DockerNetwork.getClassName(),
                this.dockerNetworkRepository.list(),
                {
                    id: dockerNetworkId
                }
            ),
            this.dockerContainerRepository.list()
        ]).spread((stack, containers) => {
            let network = (_.last(stack) as any).object;
            network._containers = _.filter(containers, {host: network.host});
            return stack;
        });
    }

    public createDockerNetwork(hostId, stack: Array<any>) {
        let columnIndex = 4;
        return Promise.all([
            this.loadObjectInColumn(
                stack,
                columnIndex,
                columnIndex - 1,
                '/create',
                DockerNetwork.getClassName(),
                this.dockerNetworkRepository.getNewInstance()
            ),
            this.dockerContainerRepository.list()
        ]).spread((stack, containers) => {
            let network = (_.last(stack) as any).object;
            network.host = hostId;
            network._containers = _.filter(containers, {host: hostId});
            return stack;
        });
    }

    public createHost(stack: Array<any>) {
        let objectType = Model.DockerHost,
            columnIndex = 2,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.dockerHostRepository.getNewDockerHost(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((dockerHost: any, uiDescriptor) => {
            context.object = dockerHost;
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
        let columnIndex = 1;
        return this.loadListInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/docker-container',
            DockerContainer.getClassName(),
            this.dockerContainerRepository.list()
        );
    }

    public getContainer(containerId, stack: Array<any>) {
        let columnIndex = 2;
        return Promise.all(_.flatten([
            this.loadObjectInColumn(
                stack,
                columnIndex,
                columnIndex - 1,
                '/_/' + containerId,
                DockerContainer.getClassName(),
                this.dockerContainerRepository.list(),
                {id: containerId}
            ),
            this.getContainerDependencies()
        ])).spread((stack: Array<any>,
                    hosts: Array<DockerHost>,
                    networks: Array<DockerNetwork>,
                    networkModes: Array<any>) => {
            let container = _.last(stack).object;
            container._hosts = hosts;
            container._networks = networks;
            container._networkModes = networkModes;
            return stack;
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
        let objectType = Model.DockerContainer,
            columnIndex = 2,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + collectionId
            };
        return Promise.all(_.flatten([
            this.dockerContainerRepository.getNewDockerContainer(),
            this.getContainerDependencies(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ])).spread((container: any,
                    hosts: Array<DockerHost>,
                    networks: Array<DockerNetwork>,
                    networkModes: Array<any>,
                    collections: Array<DockerCollection>,
                    uiDescriptor) => {
            container._collection = _.find(collections, {id: collectionId});
            container._imagesPromise = this.dockerCollectionRepository.getDockerImagesWithCollection(container._collection);
            container._hosts = hosts;
            container._networks = networks;
            container._networkModes = networkModes;
            context.object = container;

            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public getReadmeForImage(imageName, stack: Array<any>) {
        let objectType = Model.DockerImageReadme,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
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
            (dockerImageReadme as any).imageName = imageName;
            context.object = dockerImageReadme;
            context.userInterfaceDescriptor = uiDescriptor;

            return this.updateStackWithContext(stack, context);
        });
    }

    public getReadmeForContainer(containerId: string, stack: Array<any>) {
        let objectType = Model.DockerImageReadme,
            columnIndex = 3,
            parentContext = stack[columnIndex - 1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/readme'
            };
        return this.dockerContainerRepository.list().then(containers => {
            let container: any = _.find(containers, {id: containerId});
            return Promise.all([
                this.dockerImageReadmeRepository.getDockerImageReadme(),
                container.image,
                this.dockerImageRepository.getReadmeForDockerImage(container.image),
                this.modelDescriptorService.getUiDescriptorForType(objectType)
            ]);
        }).spread((dockerImageReadme, imageName, readme, uiDescriptor) => {
            (dockerImageReadme as any).imageName = imageName;
            (dockerImageReadme as any).text = readme || 'No Readme available for this container';
            context.object = dockerImageReadme;
            context.userInterfaceDescriptor = uiDescriptor;

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

    private getContainerDependencies(): Array<Promise<Array<any>>|any> {
        return [
            this.dockerHostRepository.listDockerHosts(),
            this.dockerNetworkRepository.list(),
            Promise.resolve(DockerNetworkRepository.PRIMARY_NETWORK_MODES),
            this.dockerCollectionRepository.listDockerCollections()
        ];
    }
}
