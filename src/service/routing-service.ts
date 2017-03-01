import * as _ from 'lodash';
import * as crossroads from 'crossroads';
import * as hasher from 'hasher';
import * as immutable from 'immutable';
import {ModelDescriptorService} from './model-descriptor-service';
import {MiddlewareClient} from './middleware-client';
import {ModelEventName} from '../model-event-name';
import {EventDispatcherService} from './event-dispatcher-service';
import {DatastoreService} from './datastore-service';
import {Model} from '../model';
import {SectionRoute} from '../route/section';
import {VolumeRoute} from '../route/volume';
import {ShareRoute} from '../route/share';
import {SnapshotRoute} from '../route/snapshot';
import {DatasetRoute} from '../route/dataset';
import {CalendarRoute} from '../route/calendar';
import {SystemRoute} from '../route/system';
import {ServicesRoute} from '../route/services';
import {PeeringRoute} from '../route/peering';
import {NetworkRoute} from '../route/network';
import {DockerRoute} from '../route/docker';
import {VmsRoute} from '../route/vms';
import {AccountsRoute} from '../route/accounts';
import {ReplicationRoute} from '../route/replication';

export class RoutingService {
    private static instance: RoutingService;
    private currentStacks: Map<string, Array<any>>;
    private taskStacks: immutable.Map<number|string, Array<any>>;
    private currentSectionId: string;
    private sectionRouters: Map<string, any>;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        private eventDispatcherService: EventDispatcherService,
                        private middlewareClient: MiddlewareClient,
                        private datastoreService: DatastoreService,
                        private sectionRoute: SectionRoute,
                        private volumeRoute: VolumeRoute,
                        private shareRoute: ShareRoute,
                        private snapshotRoute: SnapshotRoute,
                        private datasetRoute: DatasetRoute,
                        private calendarRoute: CalendarRoute,
                        private systemRoute: SystemRoute,
                        private serviceRoute: ServicesRoute,
                        private peeringRoute: PeeringRoute,
                        private networkRoute: NetworkRoute,
                        private dockerRoute: DockerRoute,
                        private replicationRoute: ReplicationRoute) {
        this.currentStacks = new Map<string, Array<any>>();
        this.taskStacks = immutable.Map<number|string, Array<any>>();
        this.sectionRouters = new Map<string, any>()
            .set('accounts', AccountsRoute.getInstance())
            .set('vms', VmsRoute.getInstance());

        this.eventDispatcherService.addEventListener('taskSubmitted', this.handleTaskSubmitted.bind(this));
        this.eventDispatcherService.addEventListener('taskCreated', this.handleTaskCreated.bind(this));
        this.loadRoutes();
        hasher.prependHash = '!';
        hasher.changed.add(this.handleHashChange.bind(this));
    }

    public static getInstance() {
        if (!RoutingService.instance) {
            RoutingService.instance = new RoutingService(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                MiddlewareClient.getInstance(),
                DatastoreService.getInstance(),
                SectionRoute.getInstance(),
                VolumeRoute.getInstance(),
                ShareRoute.getInstance(),
                SnapshotRoute.getInstance(),
                DatasetRoute.getInstance(),
                CalendarRoute.getInstance(),
                SystemRoute.getInstance(),
                ServicesRoute.getInstance(),
                PeeringRoute.getInstance(),
                NetworkRoute.getInstance(),
                DockerRoute.getInstance(),
                ReplicationRoute.getInstance()
            );
        }
        return RoutingService.instance;
    }

    public navigate(path: string, force?: boolean) {
        force = !!force;
        if (hasher.appendHash.length === 0) {
            hasher.appendHash = '?' + location.hash.split('?')[1] || this.middlewareClient.getExplicitHostParam();
        } else {
            hasher.appendHash = _.replace(hasher.appendHash, /^\?\?+/, '?');
        }
        if (force) {
            let section = RoutingService.getPathSection(path);
            if (path === '/' + section) {
                this.currentStacks.delete(section);
            } else {
                crossroads.ignoreState = true;
                crossroads.parse(path);
                crossroads.ignoreState = false;
            }
        }
        if (path[0] === '/') {
            hasher.setHash(path);
        } else {
            hasher.setHash(hasher.getHash() + '/' + path);
        }
    }

    public getURLFromObject(object: any) {
        let objectType = this.modelDescriptorService.getObjectType(object),
            url = objectType === Model.Section ? '/' : _.kebabCase(objectType),
            id = !_.isNil(object.id) ?
                    object.id :
                    !_.isNil(object._tmpId) ?
                        object._tmpId :
                        null;
        return (Array.isArray(object) || _.isNull(id)) ? url : url + '/_/' + encodeURIComponent(id);
    }

    public handleTaskSubmitted(temporaryTaskId: string) {
        this.saveState(temporaryTaskId);
    }
    private changeHash(newHash: string) {
        hasher.changed.active = false;
        this.navigate(newHash);
        hasher.changed.active = true;
    }

    private handleHashChange(newHash, oldHash) {
        this.eventDispatcherService.dispatch('inspectorExit').then((isBlockingNeeded) => {
            if (!isBlockingNeeded) {
                this.currentSectionId = RoutingService.getPathSection(newHash);
                crossroads.parse(decodeURIComponent(newHash));
                this.eventDispatcherService.dispatch('hashChange', newHash);
            } else {
                this.changeHash(oldHash);
                this.eventDispatcherService.dispatch('hashChange', oldHash);
            }
        });
    }

    public getCurrentPath() {
        return hasher.getHash();
    }

    public handleTaskCreated(taskIds: any) {
        if (this.taskStacks.has(taskIds.old)) {
            let task = this.taskStacks.get(taskIds.old);
            this.taskStacks = this.taskStacks.set(taskIds.new, task).delete(taskIds.old);
            let eventListener = this.eventDispatcherService.addEventListener(ModelEventName.Task.change(taskIds.new), (state) => {
                if (state.get('state') === 'FINISHED') {
                    this.taskStacks = this.taskStacks.delete(taskIds.new);
                    this.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskIds.new), eventListener);
                }
            });
        }
    }

    private saveState(temporaryTaskId: string) {
        let stateSnapshot: Array<any>;
        if (this.sectionRouters.has(this.currentSectionId)) {
            stateSnapshot = this.sectionRouters.get(this.currentSectionId).saveState();
        } else {
            stateSnapshot = [];
            let currentStack = this.currentStacks.get(this.currentSectionId);
            _.forEach(currentStack, (value, index) => {
                let context = _.clone(value);
                if (index > 0) {
                    context.parentcontext = stateSnapshot[index - 1];
                }
                stateSnapshot.push(context);
            });
        }
        this.taskStacks = this.taskStacks.set(temporaryTaskId, stateSnapshot);
    }

    private static getPathSection(path: string) {
        return _.head(_.compact(_.split(path, '/')));
    }

    private loadRoutes() {
        crossroads.addRoute('/_/retry/{taskId}',
            (taskId) => this.restoreTask(taskId));

        this.loadDashboardRoutes();
        this.loadStorageRoutes();
        this.loadNetworkRoutes();
        this.loadSettingsRoutes();
        this.loadServicesRoutes();
        this.loadConsoleRoutes();
        this.loadCalendarRoutes();
        this.loadPeeringRoutes();
        this.loadContainersRoutes();
        this.loadWizardRoutes();
    }

    private loadCalendarRoutes() {
        crossroads.addRoute('/calendar',
            () => this.calendarRoute.get().then((stack) => this.currentStacks.set('calendar', stack)));
        crossroads.addRoute('/calendar/calendar-task/_/{calendarTaskId}',
            (calendarTaskId) => this.calendarRoute.getTask(calendarTaskId, this.currentStacks.get('calendar')));
        crossroads.addRoute('/calendar/calendar-task/_/{calendarTaskId}/calendar-custom-schedule',
            () => this.calendarRoute.getCustomSchedule(this.currentStacks.get('calendar')));
        crossroads.addRoute('/calendar/calendar-task/create/{taskType}',
            (taskType) => this.calendarRoute.createTask(taskType, this.currentStacks.get('calendar')));
        crossroads.addRoute('/calendar/calendar-task/create/{taskType}/calendar-custom-schedule',
            () => this.calendarRoute.getCustomSchedule(this.currentStacks.get('calendar')));
    }

    private loadNetworkRoutes() {
        crossroads.addRoute('/network', () => this.loadSection('network'));
        crossroads.addRoute('/network/settings',
            (sectionId) => this.sectionRoute.getSettings('network', this.currentStacks.get('network')));
        crossroads.addRoute('/network/network-interface/_/{interfaceId}',
            (interfaceId) => this.networkRoute.get(interfaceId, this.currentStacks.get('network')));
        crossroads.addRoute('/network/ipmi',
            () => this.networkRoute.listIpmi(this.currentStacks.get('network')));
        crossroads.addRoute('/network/ipmi/_/{ipmiId}',
            (ipmiId) => this.networkRoute.getIpmi(ipmiId, this.currentStacks.get('network')));
        crossroads.addRoute('/network/create',
            () => this.networkRoute.selectNewInterfaceType(this.currentStacks.get('network')));
        crossroads.addRoute('/network/create/{interfaceType}',
            (interfaceType) => this.networkRoute.create(interfaceType, this.currentStacks.get('network')));
    }

    private loadContainersRoutes() {
        crossroads.addRoute('/containers', () => this.loadSection('containers'));
        crossroads.addRoute('/containers/settings',
            (sectionId) => this.sectionRoute.getSettings('containers', this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-host',
            () => this.dockerRoute.listHosts(this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-host/create',
            () => this.dockerRoute.createHost(this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-host/_/{hostId}',
            (hostId) => this.dockerRoute.getHost(hostId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-host/_/{hostId}/docker-network',
            (hostId) => this.dockerRoute.listDockerNetworks(hostId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-host/_/{hostId}/docker-network/_/{dockerNetworkId}',
            (hostId, dockerNetworkId) => this.dockerRoute.getDockerNetwork(dockerNetworkId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-host/_/{hostId}/docker-network/create',
            (hostId) => this.dockerRoute.createDockerNetwork(hostId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-image',
            () => this.dockerRoute.listImages(this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-image/create',
            () => this.dockerRoute.listCollectionsForCreate(this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-image/create/{collectionId}',
            (collectionId) => this.dockerRoute.pullImage(collectionId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-image/_/{imageId}',
            (imageId) => this.dockerRoute.getImage(imageId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-collection',
            () => this.dockerRoute.listCollections(this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-collection/_/{collectionId}',
            (collectionId) => this.dockerRoute.getCollection(collectionId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-collection/create',
            () => this.dockerRoute.createCollection(this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-container',
            () => this.dockerRoute.listContainers(this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-container/create',
            () => this.dockerRoute.listCollectionsForCreate(this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-container/create/{collectionId}',
            (collectionId) => this.dockerRoute.createContainer(collectionId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-container/create/{collectionId}/docker-image/{imageName*}/readme',
            (containerId, imageName) => this.dockerRoute.getReadmeForImage(imageName, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-container/_/{containerId}',
            (containerId) => this.dockerRoute.getContainer(containerId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-container/_/{containerId}/readme',
            (containerId) => this.dockerRoute.getReadmeForContainer(containerId, this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/docker-container/_/{containerId}/logs',
            (containerId) => this.dockerRoute.getContainerLogs(this.currentStacks.get('containers')));
        crossroads.addRoute('/containers/section-settings',
            () => this.dockerRoute.getSettings());
    }

    private loadPeeringRoutes() {
        crossroads.addRoute('/peering', () => this.loadSection('peering'));
        crossroads.addRoute('/peering/peer/_/{peerId}',
            (peerId) => this.peeringRoute.get(peerId, this.currentStacks.get('peering')));
        crossroads.addRoute('/peering/create',
            () => this.peeringRoute.selectNewPeerType(this.currentStacks.get('peering')));
        crossroads.addRoute('/peering/create/{peerType}',
            (peerType) => this.peeringRoute.create(peerType, this.currentStacks.get('peering')));
    }

    private loadSettingsRoutes() {
        crossroads.addRoute('/settings', () => this.loadSection('settings'));
        crossroads.addRoute('/settings/system-section/_/{systemSectionId}',
            (systemSectionId) => this.systemRoute.get(systemSectionId, this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/certificates/crypto-certificate/_/{certificateId}',
            (certificateId) => this.systemRoute.getCertificate(certificateId, this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/certificates/create',
            () => this.systemRoute.selectNewCertificateType(this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/certificates/create/{certificateType}',
            (certificateType) => this.systemRoute.createCertificate(certificateType, this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/alert/alert-filter/_/{filterId}',
            (filterId) => this.systemRoute.getAlertFilter(filterId, this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/alert/create',
            () => this.systemRoute.createAlertFilter(this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/alert/settings',
            () => this.systemRoute.getAlertSettings(this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/tunables/tunable/_/{tunableId}',
            (tunableId) => this.systemRoute.getTunable(tunableId, this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/tunables/create',
            () => this.systemRoute.createTunable(this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/ntpservers/ntp-server/_/{ntpServerId}',
            (ntpServerId) => this.systemRoute.getNtpServer(ntpServerId, this.currentStacks.get('settings')));
        crossroads.addRoute('/settings/system-section/_/ntpservers/create',
            () => this.systemRoute.createNtpServer(this.currentStacks.get('settings')));

    }

    private loadServicesRoutes() {
        crossroads.addRoute('/services', () => this.loadSection('services'));
        crossroads.addRoute('/services/services-category/_/{categoryId}',
            (categoryId) => this.serviceRoute.getCategory(categoryId, this.currentStacks.get('services')));
        crossroads.addRoute('/services/services-category/_/{categoryId}/service/_/{serviceId}',
            (categoryId, serviceId) => this.serviceRoute.getService(serviceId, this.currentStacks.get('services')));
        crossroads.addRoute('/services/services-category/_/{categoryId}/service/_/{serviceId}/modules',
            () => this.serviceRoute.listRsyncdModules(this.currentStacks.get('services')));
        crossroads.addRoute('/services/services-category/_/{categoryId}/service/_/{serviceId}/modules/create',
            () => this.serviceRoute.createRsyncdModule(this.currentStacks.get('services')));
        crossroads.addRoute('/services/services-category/_/{categoryId}/service/_/{serviceId}/modules/rsyncd-module/_/{moduleId}',
            (categoryId, serviceId, moduleId) => this.serviceRoute.getRsyncdModule(moduleId, this.currentStacks.get('services')));
    }

    private loadDashboardRoutes() {
        crossroads.addRoute('/dashboard', () => this.sectionRoute.getOld('dashboard'));
    }

    private loadConsoleRoutes() {
        crossroads.addRoute('/console', () => this.sectionRoute.getOld('console'));
    }

    private loadWizardRoutes() {
        crossroads.addRoute('/wizard', () => this.sectionRoute.getOld('wizard'));
    }

    private loadStorageRoutes() {
        crossroads.addRoute('/storage', () => this.loadSection('storage'));
        crossroads.addRoute('/storage/volume/_/{volumeId}',
            (volumeId) => this.volumeRoute.get(volumeId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/share',
            (volumeId) => this.shareRoute.list(volumeId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/create',
            (volumeId) => this.shareRoute.selectNewType(volumeId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/create/{type}',
            (volumeId, type) => this.shareRoute.create(volumeId, type, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/_/{shareId}',
            (volumeId, shareId) => this.shareRoute.get(volumeId, shareId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot',
            (volumeId) => this.snapshotRoute.list(volumeId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot/create',
            (volumeId) => this.snapshotRoute.create(volumeId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot/_/{snapshotId*}',
            (volumeId, snapshotId) => this.snapshotRoute.get(volumeId, snapshotId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset',
            (volumeId) => this.datasetRoute.list(volumeId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/create',
            (volumeId) => this.datasetRoute.create(volumeId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}',
            (volumeId, datasetId) => this.datasetRoute.get(volumeId, datasetId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot',
            (volumeId, datasetId) => this.snapshotRoute.listForDataset(volumeId, datasetId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot/create',
            (volumeId, datasetId) => this.snapshotRoute.createForDataset(volumeId, datasetId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot/_/{snapshotId*}',
            (volumeId, datasetId, snapshotId) => this.snapshotRoute.getForDataset(volumeId, snapshotId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset',
            (volumeId, datasetId) => this.datasetRoute.listVmware(datasetId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset/create',
            (volumeId, datasetId) => this.datasetRoute.createVmware(datasetId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset/_/{vmwareDatasetId*}',
            (volumeId, datasetId, vmwareDatasetId) => this.datasetRoute.getVmware(vmwareDatasetId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/replication',
            (volumeId, datasetId) => this.replicationRoute.createForDataset(datasetId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/share',
            (volumeId, datasetId) => this.datasetRoute.getShare(volumeId, datasetId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/topology',
            (volumeId) => this.volumeRoute.topology(volumeId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/topology/disk/_/{diskId}',
            (volumeId, diskId) => this.volumeRoute.topologyDisk(diskId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/create',
            () => this.volumeRoute.create(this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/create/disk/_/{diskId}',
            (diskId) => this.volumeRoute.creatorDisk(diskId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume-importer/_/-',
            () => this.volumeRoute.import(this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume-media-importer/_/-',
            () => this.volumeRoute.mediaImport(this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume-importer/_/-/detached-volume/_/{volumeId}',
            (volumeId) => this.volumeRoute.getDetachedVolume(volumeId, this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume-importer/_/-/detached-volume/_/{volumeId}/topology',
            (volumeId) => this.volumeRoute.getDetachedVolumeTopology(this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume-importer/_/-/encrypted',
            () => this.volumeRoute.importEncrypted(this.currentStacks.get('storage')));
        crossroads.addRoute('/storage/volume/_/{volumeId}/replication',
            (volumeId) => this.replicationRoute.list(volumeId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/replication/create',
            (volumeId) => this.replicationRoute.create(volumeId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/replication/_/{replicationId*}',
            (volumeId, replicationId) => this.replicationRoute.get(replicationId, this.currentStacks.get('storage')), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/encrypted-volume-actions',
            (volumeId) => this.volumeRoute.getEncryptedVolumeActions(volumeId, this.currentStacks.get('storage')));
    }

    private loadSection(sectionId: string) {
        let promise: Promise<Array<any>> = this.currentSectionId !== sectionId && this.currentStacks.has(sectionId) ?
            this.restorePreviousSectionStack(sectionId) :
            this.loadSectionStack(sectionId);
        this.currentSectionId = sectionId;
        promise.then((stack) => {
            if (this.currentSectionId === sectionId) {
                this.eventDispatcherService.dispatch('sectionChange', stack[0].service);
                this.eventDispatcherService.dispatch('pathChange', stack);
            }
        });
    }

    private loadSectionStack(sectionId: string) {
        return this.sectionRoute.get(sectionId).then((stack) => {
            this.currentStacks.set(sectionId, stack);
            return stack;
        });
    }

    private restorePreviousSectionStack(sectionId: string) {
        return new Promise<Array<any>>((resolve) => {
            let stack = this.currentStacks.get(sectionId);
            this.changeHash(_.last(stack).path);
            hasher.changed.addOnce(this.handleTaskHashChange.bind(this));
            resolve(stack);
        });
    }

    private restoreTask(taskId: number) {
        taskId = _.toNumber(taskId);
        if (this.taskStacks.has(taskId)) {
            hasher.appendHash +=  (hasher.appendHash.length > 0 ? '&' : '?') + 'task=' + taskId;
            let stack = _.clone(this.taskStacks.get(taskId)),
                section = stack[0].object,
                sectionId = section.id;
            let taskState = this.datastoreService.getState().get(Model.Task);
            if (taskState &&
                taskState.get(_.toString(taskId)) &&
                taskState.get(_.toString(taskId)).get('error')) {
                _.last(stack).error = taskState.get(_.toString(taskId)).get('error').toJS();
            }
            if (this.currentStacks.has(sectionId)) {
                this.currentStacks.set(sectionId, stack);
            } else {
                this.sectionRouters.get(sectionId).restore(stack);
            }
            this.eventDispatcherService.dispatch('sectionRestored', sectionId);
            this.navigate('/' + sectionId);
            hasher.changed.addOnce(this.handleTaskHashChange.bind(this));
        }
    }

    private handleTaskHashChange() {
        let hash = hasher.getHash();
        hasher.appendHash = _.join(_.filter(_.split(hasher.appendHash, '&'), (part) => !(part === '' || _.startsWith(part, 'task='))), '&');
        this.changeHash(hash);
    }
}
