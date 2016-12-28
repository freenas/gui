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
var calendar_1 = require("../route/calendar");
var RoutingService = (function () {
    function RoutingService(modelDescriptorService, eventDispatcherService, middlewareClient, sectionRoute, volumeRoute, shareRoute, snapshotRoute, datasetRoute, calendarRoute) {
        this.modelDescriptorService = modelDescriptorService;
        this.eventDispatcherService = eventDispatcherService;
        this.middlewareClient = middlewareClient;
        this.sectionRoute = sectionRoute;
        this.volumeRoute = volumeRoute;
        this.shareRoute = shareRoute;
        this.snapshotRoute = snapshotRoute;
        this.datasetRoute = datasetRoute;
        this.calendarRoute = calendarRoute;
        this.loadRoutes();
        hasher.prependHash = '!';
        hasher.changed.add(this.handleHashChange.bind(this));
    }
    RoutingService.getInstance = function () {
        if (!RoutingService.instance) {
            RoutingService.instance = new RoutingService(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), middleware_client_1.MiddlewareClient.getInstance(), section_1.SectionRoute.getInstance(), volume_1.VolumeRoute.getInstance(), share_1.ShareRoute.getInstance(), snapshot_1.SnapshotRoute.getInstance(), dataset_1.DatasetRoute.getInstance(), calendar_1.CalendarRoute.getInstance());
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
        this.currentStacks = new Map();
        this.loadDashboardRoutes();
        this.loadStorageRoutes();
        this.loadAccountsRoutes();
        this.loadNetworkRoutes();
        this.loadSettingsRoutes();
        this.loadServicesRoutes();
        this.loadConsoleRoutes();
        this.loadCalendarRoutes();
        this.loadPeeringRoutes();
        this.loadVmsRoutes();
        this.loadContainersRoutes();
        this.loadWizardRoutes();
    };
    RoutingService.prototype.loadCalendarRoutes = function () {
        var _this = this;
        crossroads.addRoute('/calendar', function () { return _this.calendarRoute.get().then(function (stack) { return _this.currentStacks.set('calendar', stack); }); });
        crossroads.addRoute('/calendar/calendar-task/_/{calendarTaskId}', function (calendarTaskId) { return _this.calendarRoute.getTask(calendarTaskId, _this.currentStacks.get('calendar')); });
    };
    RoutingService.prototype.loadNetworkRoutes = function () {
        var _this = this;
        crossroads.addRoute('/network', function () { return _this.loadSection('network'); });
    };
    RoutingService.prototype.loadContainersRoutes = function () {
        var _this = this;
        crossroads.addRoute('/containers', function () { return _this.loadSection('containers'); });
    };
    RoutingService.prototype.loadVmsRoutes = function () {
        var _this = this;
        crossroads.addRoute('/vms', function () { return _this.loadSection('vms'); });
    };
    RoutingService.prototype.loadPeeringRoutes = function () {
        var _this = this;
        crossroads.addRoute('/peering', function () { return _this.loadSection('peering'); });
    };
    RoutingService.prototype.loadSettingsRoutes = function () {
        var _this = this;
        crossroads.addRoute('/settings', function () { return _this.loadSection('settings'); });
    };
    RoutingService.prototype.loadServicesRoutes = function () {
        var _this = this;
        crossroads.addRoute('/services', function () { return _this.loadSection('services'); });
    };
    RoutingService.prototype.loadAccountsRoutes = function () {
        var _this = this;
        crossroads.addRoute('/accounts', function () { return _this.loadSection('accounts'); });
    };
    RoutingService.prototype.loadDashboardRoutes = function () {
        var _this = this;
        crossroads.addRoute('/dashboard', function () { return _this.sectionRoute.getOld('dashboard'); });
    };
    RoutingService.prototype.loadConsoleRoutes = function () {
        var _this = this;
        crossroads.addRoute('/console', function () { return _this.sectionRoute.getOld('console'); });
    };
    RoutingService.prototype.loadWizardRoutes = function () {
        var _this = this;
        crossroads.addRoute('/wizard', function () { return _this.sectionRoute.getOld('wizard'); });
    };
    RoutingService.prototype.loadStorageRoutes = function () {
        var _this = this;
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
    };
    RoutingService.prototype.loadSection = function (sectionId) {
        var _this = this;
        return this.sectionRoute.get(sectionId).then(function (stack) {
            _this.currentStacks.set(sectionId, stack);
        });
    };
    return RoutingService;
}());
exports.RoutingService = RoutingService;
