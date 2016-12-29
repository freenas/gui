"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var model_event_name_1 = require("../model-event-name");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var container_repository_1 = require("../repository/container-repository");
var DockerRoute = (function () {
    function DockerRoute(modelDescriptorService, eventDispatcherService, dockerRepository) {
        this.modelDescriptorService = modelDescriptorService;
        this.eventDispatcherService = eventDispatcherService;
        this.dockerRepository = dockerRepository;
    }
    DockerRoute.getInstance = function () {
        if (!DockerRoute.instance) {
            DockerRoute.instance = new DockerRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), container_repository_1.ContainerRepository.instance);
        }
        return DockerRoute.instance;
    };
    DockerRoute.prototype.getHosts = function (stack) {
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
            while (stack.length > columnIndex) {
                var context_1 = stack.pop();
                if (context_1 && context_1.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_1.objectType].listChange, context_1.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    DockerRoute.prototype.getHost = function (hostId, stack) {
        var _this = this;
        var objectType = 'DockerHost', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
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
            while (stack.length > columnIndex) {
                var context_2 = stack.pop();
                if (context_2 && context_2.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_2.objectType].listChange, context_2.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    DockerRoute.prototype.getImages = function (stack) {
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
            while (stack.length > columnIndex) {
                var context_3 = stack.pop();
                if (context_3 && context_3.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_3.objectType].listChange, context_3.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    DockerRoute.prototype.getImage = function (imageId, stack) {
        var _this = this;
        var objectType = 'DockerImage', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
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
            while (stack.length > columnIndex) {
                var context_4 = stack.pop();
                if (context_4 && context_4.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_4.objectType].listChange, context_4.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    DockerRoute.prototype.getCollections = function (stack) {
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
            while (stack.length > columnIndex) {
                var context_5 = stack.pop();
                if (context_5 && context_5.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_5.objectType].listChange, context_5.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    DockerRoute.prototype.getCollection = function (collectionId, stack) {
        var _this = this;
        var objectType = 'DockerCollection', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
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
            while (stack.length > columnIndex) {
                var context_6 = stack.pop();
                if (context_6 && context_6.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_6.objectType].listChange, context_6.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    DockerRoute.prototype.getContainers = function (stack) {
        var _this = this;
        var objectType = 'DockerContainer', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/docker-container/'
        };
        return Promise.all([
            this.dockerRepository.listDockerContainers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (images, uiDescriptor) {
            context.object = images;
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_7 = stack.pop();
                if (context_7 && context_7.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_7.objectType].listChange, context_7.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    DockerRoute.prototype.getContainer = function (containerId, stack) {
        var _this = this;
        var objectType = 'DockerContainer', columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
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
            while (stack.length > columnIndex) {
                var context_8 = stack.pop();
                if (context_8 && context_8.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_8.objectType].listChange, context_8.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    DockerRoute.prototype.getSettings = function (stack) {
        //todo
    };
    DockerRoute.prototype.createCollection = function (stack) {
        var _this = this;
        var objectType = 'DockerCollection', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path
        };
        return Promise.all([
            this.dockerRepository.getNewDockerCollection(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (collection, uiDescriptor) {
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = collection;
            while (stack.length > columnIndex - 1) {
                var context_9 = stack.pop();
                if (context_9 && context_9.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_9.objectType].listChange, context_9.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    DockerRoute.prototype.createContainer = function (stack) {
        var _this = this;
        var objectType = 'DockerContainer', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path
        };
        return Promise.all([
            this.dockerRepository.getNewDockerContainer(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (container, uiDescriptor) {
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = container;
            while (stack.length > columnIndex - 1) {
                var context_10 = stack.pop();
                if (context_10 && context_10.changeListener) {
                    _this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_10.objectType].listChange, context_10.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    return DockerRoute;
}());
exports.DockerRoute = DockerRoute;
