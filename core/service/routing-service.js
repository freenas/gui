"use strict";
var hasher = require("hasher");
var crossroads = require("crossroads");
var _ = require("lodash");
var model_descriptor_service_1 = require("./model-descriptor-service");
var middleware_client_1 = require("./middleware-client");
var section_1 = require("../route/section");
var volume_1 = require("../route/volume");
var share_1 = require("../route/share");
var snapshot_1 = require("../route/snapshot");
var dataset_1 = require("../route/dataset");
var event_dispatcher_service_1 = require("./event-dispatcher-service");
var calendar_1 = require("../route/calendar");
var system_1 = require("../route/system");
var services_1 = require("../route/services");
var peering_1 = require("../route/peering");
var network_1 = require("../route/network");
var docker_1 = require("../route/docker");
var vms_1 = require("../route/vms");
var accounts_1 = require("../route/accounts");
var RoutingService = (function () {
    function RoutingService(modelDescriptorService, eventDispatcherService, middlewareClient, sectionRoute, volumeRoute, shareRoute, snapshotRoute, datasetRoute, calendarRoute, systemRoute, serviceRoute, peeringRoute, vmsRoute, networkRoute, accountsRoute, dockerRoute) {
        this.modelDescriptorService = modelDescriptorService;
        this.eventDispatcherService = eventDispatcherService;
        this.middlewareClient = middlewareClient;
        this.sectionRoute = sectionRoute;
        this.volumeRoute = volumeRoute;
        this.shareRoute = shareRoute;
        this.snapshotRoute = snapshotRoute;
        this.datasetRoute = datasetRoute;
        this.calendarRoute = calendarRoute;
        this.systemRoute = systemRoute;
        this.serviceRoute = serviceRoute;
        this.peeringRoute = peeringRoute;
        this.vmsRoute = vmsRoute;
        this.networkRoute = networkRoute;
        this.accountsRoute = accountsRoute;
        this.dockerRoute = dockerRoute;
        this.currentStacks = new Map();
        this.loadRoutes();
        hasher.prependHash = '!';
        hasher.changed.add(this.handleHashChange.bind(this));
    }
    RoutingService.getInstance = function () {
        if (!RoutingService.instance) {
            RoutingService.instance = new RoutingService(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), middleware_client_1.MiddlewareClient.getInstance(), section_1.SectionRoute.getInstance(), volume_1.VolumeRoute.getInstance(), share_1.ShareRoute.getInstance(), snapshot_1.SnapshotRoute.getInstance(), dataset_1.DatasetRoute.getInstance(), calendar_1.CalendarRoute.getInstance(), system_1.SystemRoute.getInstance(), services_1.ServicesRoute.getInstance(), peering_1.PeeringRoute.getInstance(), vms_1.VmsRoute.getInstance(), network_1.NetworkRoute.getInstance(), accounts_1.AccountsRoute.getInstance(), docker_1.DockerRoute.getInstance());
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
        var objectType = this.modelDescriptorService.getObjectType(object), url = objectType === 'Section' ? '/' : _.kebabCase(objectType), id = !_.isNil(object.id) ?
            object.id :
            !_.isNil(object._tmpId) ?
                object._tmpId :
                null;
        return (Array.isArray(object) || _.isNull(id)) ? url : url + '/_/' + encodeURIComponent(id);
    };
    RoutingService.prototype.handleHashChange = function (newHash) {
        crossroads.parse(decodeURIComponent(newHash));
        this.eventDispatcherService.dispatch('hashChange', newHash);
    };
    RoutingService.prototype.loadRoutes = function () {
        var _this = this;
        crossroads.addRoute('/{sectionId}/settings', function (sectionId) { return _this.sectionRoute.getSettings(sectionId, _this.currentStacks.get(sectionId)); });
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
        crossroads.addRoute('/network/network-interface/_/{interfaceId}', function (interfaceId) { return _this.networkRoute.get(interfaceId, _this.currentStacks.get('network')); });
        crossroads.addRoute('/network/ipmi', function () { return _this.networkRoute.listIpmi(_this.currentStacks.get('network')); });
        crossroads.addRoute('/network/ipmi/_/{ipmiId}', function (ipmiId) { return _this.networkRoute.getIpmi(ipmiId, _this.currentStacks.get('network')); });
        crossroads.addRoute('/network/create', function () { return _this.networkRoute.selectNewInterfaceType(_this.currentStacks.get('network')); });
        crossroads.addRoute('/network/create/{interfaceType}', function (interfaceType) { return _this.networkRoute.create(interfaceType, _this.currentStacks.get('network')); });
    };
    RoutingService.prototype.loadContainersRoutes = function () {
        var _this = this;
        crossroads.addRoute('/containers', function () { return _this.loadSection('containers'); });
        crossroads.addRoute('/containers/docker-host', function () { return _this.dockerRoute.listHosts(_this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-host/_/{hostId}', function (hostId) { return _this.dockerRoute.getHost(hostId, _this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-image', function () { return _this.dockerRoute.listImages(_this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-image/create', function () { return _this.dockerRoute.listCollectionsForCreate(_this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-image/create/{collectionId}', function (collectionId) { return _this.dockerRoute.pullImage(collectionId, _this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-image/_/{imageId}', function (imageId) { return _this.dockerRoute.getImage(imageId, _this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-collection', function () { return _this.dockerRoute.listCollections(_this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-collection/_/{collectionId}', function (collectionId) { return _this.dockerRoute.getCollection(collectionId, _this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-collection/create', function () { return _this.dockerRoute.createCollection(_this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-container', function () { return _this.dockerRoute.listContainers(_this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-container/create', function () { return _this.dockerRoute.listCollectionsForCreate(_this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-container/create/{collectionId}', function (collectionId) { return _this.dockerRoute.createContainer(collectionId, _this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/docker-container/_/{containerId}', function (containerId) { return _this.dockerRoute.getContainer(containerId, _this.currentStacks.get('containers')); });
        crossroads.addRoute('/containers/section-settings', function () { return _this.dockerRoute.getSettings(_this.currentStacks.get('containers')); });
    };
    RoutingService.prototype.loadVmsRoutes = function () {
        var _this = this;
        crossroads.addRoute('/vms', function () { return _this.loadSection('vms'); });
        crossroads.addRoute('/vms/vm/_/{vmId}', function (vmId) { return _this.vmsRoute.get(vmId, _this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/vm/_/{vmId}/readme', function () { return _this.vmsRoute.getReadme(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/vm/_/{vmId}/devices', function () { return _this.vmsRoute.getDevices(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/vm/_/{vmId}/devices/create', function () { return _this.vmsRoute.selectNewDeviceType(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/vm/_/{vmId}/devices/create/{type}', function (vmId, type) { return _this.vmsRoute.createDevice(type, _this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/vm/_/{vmId}/devices/vm-device/_/{deviceId}', function (vmId, deviceId) { return _this.vmsRoute.getDevice(deviceId, _this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/vm/_/{vmId}/volumes', function () { return _this.vmsRoute.getVolumes(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/vm/_/{vmId}/volumes/create', function () { return _this.vmsRoute.createVolume(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/vm/_/{vmId}/volumes/vm-volume/_/{volumeId}', function (vmId, volumeId) { return _this.vmsRoute.getVolume(volumeId, _this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/create', function () { return _this.vmsRoute.create(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/create/readme', function () { return _this.vmsRoute.getReadme(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/create/devices', function () { return _this.vmsRoute.getDevices(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/create/devices/create', function () { return _this.vmsRoute.selectNewDeviceType(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/create/devices/create/{type}', function (type) { return _this.vmsRoute.createDevice(type, _this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/create/devices/vm-device/_/{deviceId}', function (deviceId) { return _this.vmsRoute.getDevice(deviceId, _this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/create/volumes', function () { return _this.vmsRoute.getVolumes(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/create/volumes/create', function () { return _this.vmsRoute.createVolume(_this.currentStacks.get('vms')); });
        crossroads.addRoute('/vms/create/volumes/vm-volume/_/{volumeId}', function (volumeId) { return _this.vmsRoute.getVolume(volumeId, _this.currentStacks.get('vms')); });
    };
    RoutingService.prototype.loadPeeringRoutes = function () {
        var _this = this;
        crossroads.addRoute('/peering', function () { return _this.loadSection('peering'); });
        crossroads.addRoute('/peering/peer/_/{peerId}', function (peerId) { return _this.peeringRoute.get(peerId, _this.currentStacks.get('peering')); });
        crossroads.addRoute('/peering/create', function () { return _this.peeringRoute.selectNewPeerType(_this.currentStacks.get('peering')); });
        crossroads.addRoute('/peering/create/{peerType}', function (peerType) { return _this.peeringRoute.create(peerType, _this.currentStacks.get('peering')); });
    };
    RoutingService.prototype.loadSettingsRoutes = function () {
        var _this = this;
        crossroads.addRoute('/settings', function () { return _this.loadSection('settings'); });
        crossroads.addRoute('/settings/system-section/_/{systemSectionId}', function (systemSectionId) { return _this.systemRoute.get(systemSectionId, _this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/certificates/crypto-certificate/_/{certificateId}', function (certificateId) { return _this.systemRoute.getCertificate(certificateId, _this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/certificates/create', function () { return _this.systemRoute.selectNewCertificateType(_this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/certificates/create/{certificateType}', function (certificateType) { return _this.systemRoute.createCertificate(certificateType, _this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/alert/alert-filter/_/{filterId}', function (filterId) { return _this.systemRoute.getAlertFilter(filterId, _this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/alert/create', function () { return _this.systemRoute.createAlertFilter(_this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/alert/settings', function () { return _this.systemRoute.getAlertSettings(_this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/tunables/tunable/_/{tunableId}', function (tunableId) { return _this.systemRoute.getTunable(tunableId, _this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/tunables/create', function () { return _this.systemRoute.createTunable(_this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/ntpservers/ntp-server/_/{ntpServerId}', function (ntpServerId) { return _this.systemRoute.getNtpServer(ntpServerId, _this.currentStacks.get('settings')); });
        crossroads.addRoute('/settings/system-section/_/ntpservers/create', function () { return _this.systemRoute.createNtpServer(_this.currentStacks.get('settings')); });
    };
    RoutingService.prototype.loadServicesRoutes = function () {
        var _this = this;
        crossroads.addRoute('/services', function () { return _this.loadSection('services'); });
        crossroads.addRoute('/services/services-category/_/{categoryId}', function (categoryId) { return _this.serviceRoute.getCategory(categoryId, _this.currentStacks.get('services')); });
        crossroads.addRoute('/services/services-category/_/{categoryId}/service/_/{serviceId}', function (categoryId, serviceId) { return _this.serviceRoute.getService(serviceId, _this.currentStacks.get('services')); });
        crossroads.addRoute('/services/services-category/_/{categoryId}/service/_/{serviceId}/modules', function () { return _this.serviceRoute.listRsyncdModules(_this.currentStacks.get('services')); });
        crossroads.addRoute('/services/services-category/_/{categoryId}/service/_/{serviceId}/modules/create', function () { return _this.serviceRoute.createRsyncdModule(_this.currentStacks.get('services')); });
        crossroads.addRoute('/services/services-category/_/{categoryId}/service/_/{serviceId}/modules/rsyncd-module/_/{moduleId}', function (categoryId, serviceId, moduleId) { return _this.serviceRoute.getRsyncdModule(moduleId, _this.currentStacks.get('services')); });
    };
    RoutingService.prototype.loadAccountsRoutes = function () {
        var _this = this;
        crossroads.addRoute('/accounts', function () { return _this.loadSection('accounts'); });
        crossroads.addRoute('/accounts/user', function () { return _this.accountsRoute.listUsers(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/user/create', function () { return _this.accountsRoute.createUser(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/user/_/{userId}', function (userId) { return _this.accountsRoute.getUser(userId, _this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/group', function () { return _this.accountsRoute.listGroups(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/group/create', function () { return _this.accountsRoute.createGroup(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/group/_/{groupId}', function (groupId) { return _this.accountsRoute.getGroup(groupId, _this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/account-system', function () { return _this.accountsRoute.listAccountSystems(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/account-system/user/_/{userId}', function (userId) { return _this.accountsRoute.getUser(userId, _this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/account-system/group/_/{groupId}', function (groupId) { return _this.accountsRoute.getGroup(groupId, _this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/directory-services', function () { return _this.accountsRoute.getDirectoryServices(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/directory-services/directory/_/{directoryId}', function (directoryId) { return _this.accountsRoute.getDirectory(directoryId, _this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/directory-services/kerberos-realm', function () { return _this.accountsRoute.listKerberosRealms(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/directory-services/kerberos-realm/create', function () { return _this.accountsRoute.createKerberosRealm(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/directory-services/kerberos-realm/_/{kerberosRealmId}', function (kerberosRealmId) { return _this.accountsRoute.getKerberosRealm(kerberosRealmId, _this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/directory-services/kerberos-keytab', function () { return _this.accountsRoute.listKerberosKeytabs(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/directory-services/kerberos-keytab/create', function () { return _this.accountsRoute.createKerberosKeytab(_this.currentStacks.get('accounts')); });
        crossroads.addRoute('/accounts/directory-services/kerberos-keytab/_/{kerberosKeytabId}', function (kerberosKeytabId) { return _this.accountsRoute.getKerberosKeytab(kerberosKeytabId, _this.currentStacks.get('accounts')); });
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
        crossroads.addRoute('/storage/volume/_/{volumeId}', function (volumeId) { return _this.volumeRoute.get(volumeId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/share', function (volumeId) { return _this.shareRoute.list(volumeId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/create', function (volumeId) { return _this.shareRoute.selectNewType(volumeId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/create/{type}', function (volumeId, type) { return _this.shareRoute.create(volumeId, type, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/_/{shareId}', function (volumeId, shareId) { return _this.shareRoute.get(volumeId, shareId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot', function (volumeId) { return _this.snapshotRoute.list(volumeId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot/create', function (volumeId) { return _this.snapshotRoute.create(volumeId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot/_/{snapshotId*}', function (volumeId, snapshotId) { return _this.snapshotRoute.get(volumeId, snapshotId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset', function (volumeId) { return _this.datasetRoute.list(volumeId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/create', function (volumeId) { return _this.datasetRoute.create(volumeId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}', function (volumeId, datasetId) { return _this.datasetRoute.get(volumeId, datasetId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot', function (volumeId, datasetId) { return _this.snapshotRoute.listForDataset(volumeId, datasetId, _this.currentStacks.get('storage')); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot/create', function (volumeId, datasetId) { return _this.snapshotRoute.createForDataset(volumeId, datasetId, _this.currentStacks.get('storage')); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot/_/{snapshotId*}', function (volumeId, datasetId, snapshotId) { return _this.snapshotRoute.getForDataset(volumeId, snapshotId, _this.currentStacks.get('storage')); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset', function (volumeId, datasetId) { return _this.datasetRoute.listVmware(datasetId, _this.currentStacks.get('storage')); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset/create', function (volumeId, datasetId) { return _this.datasetRoute.createVmware(datasetId, _this.currentStacks.get('storage')); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset/_/{vmwareDatasetId*}', function (volumeId, datasetId, vmwareDatasetId) { return _this.datasetRoute.getVmware(vmwareDatasetId, _this.currentStacks.get('storage')); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/replication', function (volumeId, datasetId) { return _this.datasetRoute.replication(datasetId, _this.currentStacks.get('storage')); }, 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/topology', function (volumeId) { return _this.volumeRoute.getVolumeTopology(_this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume/_/{volumeId}/topology/disk/_/{diskId}', function (volumeId, diskId) { return _this.volumeRoute.topologyDisk(diskId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/create', function () { return _this.volumeRoute.create(_this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/create/disk/_/{diskId}', function (diskId) { return _this.volumeRoute.creatorDisk(diskId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume-importer/_/-', function () { return _this.volumeRoute.import(_this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume-media-importer/_/-', function () { return _this.volumeRoute.mediaImport(_this.currentStacks.get("storage")); });
        crossroads.addRoute('/storage/volume-importer/_/-/detached-volume/_/{volumeId}', function (volumeId) { return _this.volumeRoute.getDetachedVolume(volumeId, _this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume-importer/_/-/detached-volume/_/{volumeId}/topology', function (volumeId) { return _this.volumeRoute.getDetachedVolumeTopology(_this.currentStacks.get('storage')); });
        crossroads.addRoute('/storage/volume-importer/_/-/encrypted', function () { return _this.volumeRoute.importEncrypted(_this.currentStacks.get('storage')); });
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
