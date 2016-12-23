"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_section_service_ng_1 = require("./abstract-section-service-ng");
var peer_repository_1 = require("../../repository/peer-repository");
var model_event_name_1 = require("../../model-event-name");
var PeeringSectionService = (function (_super) {
    __extends(PeeringSectionService, _super);
    function PeeringSectionService() {
        _super.apply(this, arguments);
        this.PEER_TYPES = peer_repository_1.PeerRepository.PEER_TYPES;
    }
    PeeringSectionService.prototype.init = function () {
        this.peerRepository = peer_repository_1.PeerRepository.getInstance();
        this.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Peer.listChange, this.handlePeersChange.bind(this));
    };
    PeeringSectionService.prototype.getNewPeerWithType = function (peerType) {
        return this.peerRepository.getNewPeerWithType(peerType);
    };
    PeeringSectionService.prototype.loadEntries = function () {
        this.entries = [];
        return this.peerRepository.listPeers();
    };
    PeeringSectionService.prototype.loadExtraEntries = function () {
    };
    PeeringSectionService.prototype.loadSettings = function () {
    };
    PeeringSectionService.prototype.loadOverview = function () {
    };
    PeeringSectionService.prototype.handlePeersChange = function (state) {
        var self = this;
        state.forEach(function (stateEntry) {
            // DTM
            var entry = self.findObjectWithId(self.entries, stateEntry.get('id'));
            if (entry) {
                Object.assign(entry, stateEntry.toJS());
            }
            else {
                entry = stateEntry.toJS();
                entry._objectType = 'Peer';
                self.entries.push(entry);
            }
        });
        // DTM
        if (this.entries) {
            for (var i = this.entries.length - 1; i >= 0; i--) {
                if (!state.has(this.entries[i].id)) {
                    this.entries.splice(i, 1);
                }
            }
        }
    };
    return PeeringSectionService;
}(abstract_section_service_ng_1.AbstractSectionService));
exports.PeeringSectionService = PeeringSectionService;
