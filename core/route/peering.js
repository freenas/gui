"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var Promise = require("bluebird");
var model_event_name_1 = require("../model-event-name");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var peer_repository_1 = require("../repository/peer-repository");
var abstract_route_1 = require("./abstract-route");
var model_1 = require("../model");
var PeeringRoute = (function (_super) {
    __extends(PeeringRoute, _super);
    function PeeringRoute(modelDescriptorService, eventDispatcherService, peerRepository) {
        var _this = _super.call(this, eventDispatcherService) || this;
        _this.modelDescriptorService = modelDescriptorService;
        _this.peerRepository = peerRepository;
        _this.objectType = model_1.Model.Peer;
        return _this;
    }
    PeeringRoute.getInstance = function () {
        if (!PeeringRoute.instance) {
            PeeringRoute.instance = new PeeringRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), peer_repository_1.PeerRepository.getInstance());
        }
        return PeeringRoute.instance;
    };
    PeeringRoute.prototype.get = function (peerId, stack) {
        var self = this, objectType = this.objectType, columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/peer/_/' + encodeURIComponent(peerId)
        };
        return Promise.all([
            this.peerRepository.listPeers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (peers, uiDescriptor) {
            context.object = _.find(peers, { id: peerId });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_1 = stack.pop();
                if (context_1 && context_1.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_1.objectType].listChange, context_1.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    PeeringRoute.prototype.selectNewPeerType = function (stack) {
        var _this = this;
        var self = this, objectType = this.objectType, columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            isCreatePrevented: true,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            Promise.all(_.map(_.values(peer_repository_1.PeerRepository.PEER_TYPES), function (type) { return _this.peerRepository.getNewPeerWithType(type); })),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (peers, uiDescriptor) {
            peers._objectType = objectType;
            context.object = _.compact(peers);
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    PeeringRoute.prototype.create = function (peerType, stack) {
        var self = this, objectType = this.objectType, columnIndex = 1, parentContext = stack[columnIndex], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/' + peerType
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            var share = _.find(parentContext.object, { _tmpId: peerType });
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = share;
            return self.updateStackWithContext(stack, context);
        });
    };
    return PeeringRoute;
}(abstract_route_1.AbstractRoute));
exports.PeeringRoute = PeeringRoute;
