"use strict";
var _ = require("lodash");
var crossroads = require("crossroads");
var model_descriptor_service_1 = require("./model-descriptor-service");
var middleware_client_1 = require("./middleware-client");
var hasher = require("hasher");
var section_1 = require("../route/section");
var volume_1 = require("../route/volume");
var share_1 = require("../route/share");
var snapshot_1 = require("../route/snapshot");
var dataset_1 = require("../route/dataset");
var event_dispatcher_service_1 = require("./event-dispatcher-service");
var RoutingService = (function () {
    function RoutingService(modelDescriptorService, eventDispatcherService, middlewareClient, sectionRoute, volumeRoute, shareRoute, snapshotRoute, datasetRoute) {
        this.modelDescriptorService = modelDescriptorService;
        this.eventDispatcherService = eventDispatcherService;
        this.middlewareClient = middlewareClient;
        this.sectionRoute = sectionRoute;
        this.volumeRoute = volumeRoute;
        this.shareRoute = shareRoute;
        this.snapshotRoute = snapshotRoute;
        this.datasetRoute = datasetRoute;
        this.loadRoutes();
        hasher.prependHash = '!';
        hasher.changed.add(this.handleHashChange.bind(this));
    }
    RoutingService.getInstance = function () {
        if (!RoutingService.instance) {
            RoutingService.instance = new RoutingService(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), middleware_client_1.MiddlewareClient.getInstance(), section_1.SectionRoute.getInstance(), volume_1.VolumeRoute.getInstance(), share_1.ShareRoute.getInstance(), snapshot_1.SnapshotRoute.getInstance(), dataset_1.DatasetRoute.getInstance());
        }
        return RoutingService.instance;
    };
    RoutingService.prototype.navigate = function (path) {
        hasher.appendHash = ';' + this.middlewareClient.getExplicitHostParam();
        if (path[0] === '/') {
            hasher.setHash(path);
        }
        else {
            hasher.setHash(hasher.getHash() + '/' + path);
        }
    };
    RoutingService.prototype.getURLFromObject = function (object) {
        var objectType = this.modelDescriptorService.getObjectType(object), url = objectType === 'Section' ? '/' : _.kebabCase(objectType) + '/_/';
        return url + object.id;
    };
    RoutingService.prototype.handleHashChange = function (newHash, oldHash) {
        crossroads.parse(newHash);
        this.eventDispatcherService.dispatch('hashChange', newHash);
    };
    RoutingService.prototype.loadRoutes = function () {
        var _this = this;
        this.currentStacks = new Map();
        crossroads.addRoute('/storage', function () { return _this.loadSection('storage'); });
        crossroads.addRoute('/storage/volume/_/{volumeId}', function (volumeId) { return _this.volumeRoute.get(volumeId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/share', function (volumeId) { return _this.shareRoute.list(volumeId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/create', function (volumeId) { return _this.shareRoute.selectNewType(volumeId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/create/{type}', function (volumeId, type) { return _this.shareRoute.create(volumeId, type, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/_/{shareId}', function (volumeId, shareId) { return _this.shareRoute.get(volumeId, shareId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot', function (volumeId) { return _this.snapshotRoute.list(volumeId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot/create', function (volumeId) { return _this.snapshotRoute.create(volumeId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot/_/{snapshotId*}', function (volumeId, snapshotId) { return _this.snapshotRoute.get(volumeId, snapshotId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset', function (volumeId) { return _this.datasetRoute.list(volumeId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/create', function (volumeId) { return _this.datasetRoute.create(volumeId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}', function (volumeId, datasetId) { return _this.datasetRoute.get(volumeId, datasetId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot', function (volumeId, datasetId) { return _this.snapshotRoute.listForDataset(volumeId, datasetId, _this.currentStacks.get("storage")); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot/create', function (volumeId, datasetId) { return _this.snapshotRoute.createForDataset(volumeId, datasetId, _this.currentStacks.get("storage")); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot/_/{snapshotId*}', function (volumeId, datasetId, snapshotId) { return _this.snapshotRoute.getForDataset(volumeId, snapshotId, _this.currentStacks.get("storage")); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset', function (volumeId, datasetId) { return _this.datasetRoute.listVmware(datasetId, _this.currentStacks.get("storage")); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset/create', function (volumeId, datasetId) { return _this.datasetRoute.createVmware(datasetId, _this.currentStacks.get("storage")); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset/_/{vmwareDatasetId*}', function (volumeId, datasetId, vmwareDatasetId) { return _this.datasetRoute.getVmware(vmwareDatasetId, _this.currentStacks.get("storage")); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/replication', function (volumeId, datasetId) { return _this.datasetRoute.replication(datasetId, _this.currentStacks.get("storage")); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/topology', function (volumeId) { return _this.volumeRoute.topology(volumeId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/topology/disk/_/{diskId}', function (volumeId, diskId) { return _this.volumeRoute.topologyDisk(diskId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/create', function () { return _this.volumeRoute.create(_this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/create/disk/_/{diskId}', function (diskId) { return _this.volumeRoute.creatorDisk(diskId, _this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume-importer/_/-', function () { return _this.volumeRoute.import(_this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume-importer/_/-/encrypted', function () { return _this.volumeRoute.importEncrypted(_this.currentStacks.get("storage")); });
        crossroads.addRoute('/accounts', function () { return _this.loadSection('accounts'); });
    };
    RoutingService.prototype.loadSection = function (sectionDescriptor) {
        var _this = this;
        return this.sectionRoute.get(sectionDescriptor).then(function (stack) {
            _this.currentStacks.set(sectionDescriptor, stack);
        });
    };
    return RoutingService;
}());
exports.RoutingService = RoutingService;
