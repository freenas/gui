"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var share_repository_1 = require("../repository/share-repository");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var volume_repository_1 = require("../repository/volume-repository");
var model_event_name_1 = require("../model-event-name");
var data_object_change_service_1 = require("../service/data-object-change-service");
var abstract_route_1 = require("./abstract-route");
var Promise = require("bluebird");
var _ = require("lodash");
var model_1 = require("../model");
var ShareRoute = (function (_super) {
    __extends(ShareRoute, _super);
    function ShareRoute(shareRepository, volumeRepository, eventDispatcherService, modelDescriptorService, dataObjectChangeService) {
        var _this = _super.call(this, eventDispatcherService) || this;
        _this.shareRepository = shareRepository;
        _this.volumeRepository = volumeRepository;
        _this.modelDescriptorService = modelDescriptorService;
        _this.dataObjectChangeService = dataObjectChangeService;
        return _this;
    }
    ShareRoute.getInstance = function () {
        if (!ShareRoute.instance) {
            ShareRoute.instance = new ShareRoute(share_repository_1.ShareRepository.getInstance(), volume_repository_1.VolumeRepository.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), model_descriptor_service_1.ModelDescriptorService.getInstance(), new data_object_change_service_1.DataObjectChangeService());
        }
        return ShareRoute.instance;
    };
    ShareRoute.prototype.list = function (volumeId, stack) {
        var self = this, objectType = model_1.Model.Share;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.shareRepository.listShares(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
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
            filteredShares._objectType = objectType;
            var context = {
                object: filteredShares,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: objectType,
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
        var self = this, objectType = model_1.Model.Share;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.shareRepository.listShares(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
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
                objectType: objectType,
                parentContext: stack[2],
                path: stack[2].path + '/share/_/' + encodeURIComponent(shareId)
            });
            return stack;
        });
    };
    ShareRoute.prototype.selectNewType = function (volumeId, stack) {
        var self = this, objectType = model_1.Model.Share, context = {
            columnIndex: 3,
            objectType: objectType,
            parentContext: stack[2],
            isCreatePrevented: true,
            path: stack[2].path + '/create'
        };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
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
                shares._objectType = objectType;
                context.object = shares;
                return self.updateStackWithContext(stack, context);
            });
        });
    };
    ShareRoute.prototype.create = function (volumeId, type, stack) {
        var self = this, objectType = model_1.Model.Share, columnIndex = 3, parentContext = stack[columnIndex], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/' + type
        };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (volumes, uiDescriptor) {
            var share = _.find(parentContext.object, { type: type });
            share._volume = _.find(volumes, { id: volumeId });
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = share;
            return self.updateStackWithContext(stack, context);
        });
    };
    return ShareRoute;
}(abstract_route_1.AbstractRoute));
exports.ShareRoute = ShareRoute;
