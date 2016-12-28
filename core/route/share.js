"use strict";
var share_repository_1 = require("../repository/share-repository");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var Promise = require("bluebird");
var _ = require("lodash");
var volume_repository_1 = require("../repository/volume-repository");
var model_event_name_1 = require("../model-event-name");
var data_object_change_service_1 = require("../service/data-object-change-service");
var ShareRoute = (function () {
    function ShareRoute(shareRepository, volumeRepository, eventDispatcherService, modelDescriptorService, dataObjectChangeService) {
        this.shareRepository = shareRepository;
        this.volumeRepository = volumeRepository;
        this.eventDispatcherService = eventDispatcherService;
        this.modelDescriptorService = modelDescriptorService;
        this.dataObjectChangeService = dataObjectChangeService;
    }
    ShareRoute.getInstance = function () {
        if (!ShareRoute.instance) {
            ShareRoute.instance = new ShareRoute(share_repository_1.ShareRepository.getInstance(), volume_repository_1.VolumeRepository.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), model_descriptor_service_1.ModelDescriptorService.getInstance(), new data_object_change_service_1.DataObjectChangeService());
        }
        return ShareRoute.instance;
    };
    ShareRoute.prototype.list = function (volumeId, stack) {
        var self = this;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.shareRepository.listShares(),
            this.modelDescriptorService.getUiDescriptorForType('Share')
        ]).spread(function (volumes, shares, uiDescriptor) {
            while (stack.length > 2) {
                var oldContext = stack.pop();
                if (oldContext && oldContext.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[oldContext.objectType].listChange, oldContext.changeListener);
                }
            }
            var shareFilter = function (share) {
                return _.startsWith(share.target_path + '/', volumeId + '/') ||
                    _.startsWith(share.target_path + '/', '/mnt/' + volumeId + '/');
            };
            var filteredShares = _.filter(shares, shareFilter);
            filteredShares._objectType = 'Share';
            var context = {
                object: filteredShares,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: 'Share',
                parentContext: stack[1],
                path: stack[1].path + '/share',
                changeListener: self.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Share.listChange, function (state) {
                    self.dataObjectChangeService.handleDataChange(filteredShares, state);
                    for (var i = filteredShares.length - 1; i >= 0; i--) {
                        if (!shareFilter(filteredShares[i])) {
                            filteredShares.splice(i, 1);
                        }
                    }
                })
            };
            stack.push(context);
            return stack;
        });
    };
    ShareRoute.prototype.get = function (volumeId, shareId, stack) {
        var self = this;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.shareRepository.listShares(),
            this.modelDescriptorService.getUiDescriptorForType('Share')
        ]).spread(function (volumes, shares, uiDescriptor) {
            while (stack.length > 3) {
                var context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }
            var share = _.find(shares, { id: shareId });
            share._volume = _.find(volumes, { id: volumeId });
            stack.push({
                object: share,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 3,
                objectType: 'Share',
                parentContext: stack[2],
                path: stack[2].path + '/share/_/' + shareId
            });
            return stack;
        });
    };
    ShareRoute.prototype.selectNewType = function (volumeId, stack) {
        var self = this, context = {
            columnIndex: 3,
            objectType: 'Share',
            parentContext: stack[2],
            path: stack[2].path + '/create'
        };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType('Share')
        ]).spread(function (volumes, uiDescriptor) {
            var volume = _.find(volumes, { id: volumeId });
            context.userInterfaceDescriptor = uiDescriptor;
            return Promise.all([
                self.shareRepository.getNewShare(volume, 'smb'),
                self.shareRepository.getNewShare(volume, 'nfs'),
                self.shareRepository.getNewShare(volume, 'afp'),
                self.shareRepository.getNewShare(volume, 'iscsi'),
                self.shareRepository.getNewShare(volume, 'webdav')
            ]).then(function (shares) {
                shares._objectType = 'Share';
                context.object = shares;
                while (stack.length > 3) {
                    var context_1 = stack.pop();
                    if (context_1 && context_1.changeListener) {
                        self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_1.objectType].listChange, context_1.changeListener);
                    }
                }
                stack.push(context);
                return stack;
            });
        });
    };
    ShareRoute.prototype.create = function (volumeId, type, stack) {
        var self = this, columnIndex = 4, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: 'Share',
            parentContext: parentContext,
            path: parentContext.path + '/' + type
        };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType('Share')
        ]).spread(function (volumes, uiDescriptor) {
            var share = _.find(parentContext.object, { type: type });
            share._volume = _.find(volumes, { id: volumeId });
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = share;
            while (stack.length > columnIndex - 1) {
                var context_2 = stack.pop();
                if (context_2 && context_2.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_2.objectType].listChange, context_2.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    return ShareRoute;
}());
exports.ShareRoute = ShareRoute;
