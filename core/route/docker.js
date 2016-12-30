"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var Promise = require("bluebird");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var container_repository_1 = require("../repository/container-repository");
var abstract_route_1 = require("./abstract-route");
var DockerRoute = (function (_super) {
    __extends(DockerRoute, _super);
    function DockerRoute(modelDescriptorService, eventDispatcherService, dockerRepository) {
        _super.call(this, eventDispatcherService);
        this.modelDescriptorService = modelDescriptorService;
        this.dockerRepository = dockerRepository;
    }
    DockerRoute.getInstance = function () {
        if (!DockerRoute.instance) {
            DockerRoute.instance = new DockerRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), container_repository_1.ContainerRepository.instance);
        }
        return DockerRoute.instance;
    };
    DockerRoute.prototype.listHosts = function (stack) {
        var _this = this;
        var objectType = 'DockerHost', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/docker-host'
        };
        return Promise.all([
            this.dockerRepository.listDockerHosts(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (hosts, uiDescriptor) {
            context.object = hosts;
            context.userInterfaceDescriptor = uiDescriptor;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.getHost = function (hostId, stack) {
        var _this = this;
        var objectType = 'DockerHost', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + hostId
        };
        return Promise.all([
            this.dockerRepository.listDockerHosts(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (hosts, uiDescriptor) {
            context.object = _.find(hosts, { id: hostId });
            context.userInterfaceDescriptor = uiDescriptor;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.listImages = function (stack) {
        var _this = this;
        var objectType = 'DockerImage', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/docker-image'
        };
        return Promise.all([
            this.dockerRepository.listDockerImages(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (images, uiDescriptor) {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.getImage = function (imageId, stack) {
        var _this = this;
        var objectType = 'DockerImage', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + imageId
        };
        return Promise.all([
            this.dockerRepository.listDockerImages(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (images, uiDescriptor) {
            context.object = _.find(images, { id: imageId });
            context.userInterfaceDescriptor = uiDescriptor;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.pullImage = function (collectionId, stack) {
        var _this = this;
        var objectType = 'DockerImagePull', columnIndex = 2, parentContext = stack[columnIndex], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path
        };
        return Promise.all([
            this.dockerRepository.getNewDockerImage(),
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (image, collections, uiDescriptor) {
            var collection = _.find(collections, { id: collectionId });
            image.dockerCollection = collection;
            image._isNewObject = true;
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = image;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.listCollections = function (stack) {
        var _this = this;
        var objectType = 'DockerCollection', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/docker-collection'
        };
        return Promise.all([
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (images, uiDescriptor) {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.getCollection = function (collectionId, stack) {
        var _this = this;
        var objectType = 'DockerCollection', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + collectionId
        };
        return Promise.all([
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (collections, uiDescriptor) {
            context.object = _.find(collections, { id: collectionId });
            context.userInterfaceDescriptor = uiDescriptor;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.listContainers = function (stack) {
        var _this = this;
        var objectType = 'DockerContainer', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/docker-container'
        };
        return Promise.all([
            this.dockerRepository.listDockerContainers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (images, uiDescriptor) {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.getContainer = function (containerId, stack) {
        var _this = this;
        var objectType = 'DockerContainer', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/_/' + containerId
        };
        return Promise.all([
            this.dockerRepository.listDockerContainers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (containers, uiDescriptor) {
            context.object = _.find(containers, { id: containerId });
            context.userInterfaceDescriptor = uiDescriptor;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.getSettings = function (stack) {
        //todo
    };
    DockerRoute.prototype.listCollectionsForCreate = function (stack) {
        var _this = this;
        var objectType = 'DockerCollection', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + "/create",
            isCreatePrevented: true
        };
        return Promise.all([
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (collections, uiDescriptor) {
            context.object = collections;
            context.userInterfaceDescriptor = uiDescriptor;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.createCollection = function (stack) {
        var _this = this;
        var objectType = 'DockerCollection', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + "/create"
        };
        return Promise.all([
            this.dockerRepository.getNewDockerCollection(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (collection, uiDescriptor) {
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = collection;
            return _this.updateStackWithContext(stack, context);
        });
    };
    DockerRoute.prototype.createContainer = function (collectionId, stack) {
        var _this = this;
        var objectType = 'DockerContainerCreator', columnIndex = 2, parentContext = stack[columnIndex], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path
        };
        return Promise.all([
            this.dockerRepository.getNewDockerContainer(),
            this.dockerRepository.listDockerCollections(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (container, collections, uiDescriptor) {
            var collection = _.find(collections, { id: collectionId });
            container.dockerCollection = collection;
            container._isNewObject = true;
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = container;
            return _this.updateStackWithContext(stack, context);
        });
    };
    return DockerRoute;
}(abstract_route_1.AbstractRoute));
exports.DockerRoute = DockerRoute;
