import hasher = require("hasher");
import * as crossroads from "crossroads";
import * as _ from "lodash";
import {ModelDescriptorService} from "./model-descriptor-service";
import {MiddlewareClient} from "./middleware-client";
import {SectionRoute} from "../route/section";
import {VolumeRoute} from "../route/volume";
import {ShareRoute} from "../route/share";
import {SnapshotRoute} from "../route/snapshot";
import {DatasetRoute} from "../route/dataset";
import {EventDispatcherService} from "./event-dispatcher-service";
import {CalendarRoute} from "../route/calendar";
import {SystemRoute} from "../route/system";
import {ServicesRoute} from "../route/services";

export class RoutingService {
    private static instance: RoutingService;
    private currentStacks: Map<string, Array<any>>;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        private eventDispatcherService: EventDispatcherService,
                        private middlewareClient: MiddlewareClient,
                        private sectionRoute: SectionRoute,
                        private volumeRoute: VolumeRoute,
                        private shareRoute: ShareRoute,
                        private snapshotRoute: SnapshotRoute,
                        private datasetRoute: DatasetRoute,
                        private calendarRoute: CalendarRoute,
                        private systemRoute: SystemRoute,
                        private serviceRoute: ServicesRoute) {
        this.currentStacks = new Map<string, any>();

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
                SectionRoute.getInstance(),
                VolumeRoute.getInstance(),
                ShareRoute.getInstance(),
                SnapshotRoute.getInstance(),
                DatasetRoute.getInstance(),
                CalendarRoute.getInstance(),
                SystemRoute.getInstance(),
                ServicesRoute.getInstance()
            );
        }
        return RoutingService.instance;
    }

    public navigate(path: string) {
        hasher.appendHash = ';' + this.middlewareClient.getExplicitHostParam();
        if (path[0] === '/') {
            hasher.setHash(path)
        } else {
            hasher.setHash(hasher.getHash() + '/' + path);
        }
    }

    public getURLFromObject(object: any) {
        let objectType = this.modelDescriptorService.getObjectType(object),
            url = objectType === 'Section' ? '/' : _.kebabCase(objectType) + '/_/';
        return url + object.id;
    }

    private handleHashChange(newHash, oldHash) {
        crossroads.parse(newHash);
        this.eventDispatcherService.dispatch('hashChange', newHash);
    }

    private loadRoutes() {
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
    }

    private loadCalendarRoutes() {
        crossroads.addRoute('/calendar',
            () => this.calendarRoute.get().then((stack) => this.currentStacks.set('calendar', stack)));
        crossroads.addRoute('/calendar/calendar-task/_/{calendarTaskId}',
            (calendarTaskId) => this.calendarRoute.getTask(calendarTaskId, this.currentStacks.get('calendar')));
    }

    private loadNetworkRoutes() {
        crossroads.addRoute('/network', () => this.loadSection('network'));
    }

    private loadContainersRoutes() {
        crossroads.addRoute('/containers', () => this.loadSection('containers'));
    }

    private loadVmsRoutes() {
        crossroads.addRoute('/vms', () => this.loadSection('vms'));
    }

    private loadPeeringRoutes() {
        crossroads.addRoute('/peering', () => this.loadSection('peering'));
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
    }

    private loadAccountsRoutes() {
        crossroads.addRoute('/accounts', () => this.loadSection('accounts'));
    }

    private loadDashboardRoutes() {
        crossroads.addRoute('/dashboard', () => this.sectionRoute.getOld('dashboard'))
    }

    private loadConsoleRoutes() {
        crossroads.addRoute('/console', () => this.sectionRoute.getOld('console'))
    }

    private loadWizardRoutes() {
        crossroads.addRoute('/wizard', () => this.sectionRoute.getOld('wizard'))
    }

    private loadStorageRoutes() {
        crossroads.addRoute('/storage', () => this.loadSection('storage'));
        crossroads.addRoute('/storage/volume/_/{volumeId}',
            (volumeId) => this.volumeRoute.get(volumeId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/share',
            (volumeId) => this.shareRoute.list(volumeId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/create',
            (volumeId) => this.shareRoute.selectNewType(volumeId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/create/{type}',
            (volumeId, type) => this.shareRoute.create(volumeId, type, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/share/_/{shareId}',
            (volumeId, shareId) => this.shareRoute.get(volumeId, shareId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot',
            (volumeId) => this.snapshotRoute.list(volumeId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot/create',
            (volumeId) => this.snapshotRoute.create(volumeId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-snapshot/_/{snapshotId*}',
            (volumeId, snapshotId) => this.snapshotRoute.get(volumeId, snapshotId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset',
            (volumeId) => this.datasetRoute.list(volumeId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/create',
            (volumeId) => this.datasetRoute.create(volumeId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}',
            (volumeId, datasetId) => this.datasetRoute.get(volumeId, datasetId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot',
            (volumeId, datasetId) => this.snapshotRoute.listForDataset(volumeId, datasetId, this.currentStacks.get("storage")), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot/create',
            (volumeId, datasetId) => this.snapshotRoute.createForDataset(volumeId, datasetId, this.currentStacks.get("storage")), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/volume-snapshot/_/{snapshotId*}',
            (volumeId, datasetId, snapshotId) => this.snapshotRoute.getForDataset(volumeId, snapshotId, this.currentStacks.get("storage")), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset',
            (volumeId, datasetId) => this.datasetRoute.listVmware(datasetId, this.currentStacks.get("storage")), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset/create',
            (volumeId, datasetId) => this.datasetRoute.createVmware(datasetId, this.currentStacks.get("storage")), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/vmware-dataset/_/{vmwareDatasetId*}',
            (volumeId, datasetId, vmwareDatasetId) => this.datasetRoute.getVmware(vmwareDatasetId, this.currentStacks.get("storage")), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/volume-dataset/_/{datasetId*}/replication',
            (volumeId, datasetId) => this.datasetRoute.replication(datasetId, this.currentStacks.get("storage")), 1);
        crossroads.addRoute('/storage/volume/_/{volumeId}/topology',
            (volumeId) => this.volumeRoute.topology(volumeId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume/_/{volumeId}/topology/disk/_/{diskId}',
            (volumeId, diskId) => this.volumeRoute.topologyDisk(diskId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/create',
            () => this.volumeRoute.create(this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/create/disk/_/{diskId}',
            (diskId) => this.volumeRoute.creatorDisk(diskId, this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume-importer/_/-',
            () => this.volumeRoute.import(this.currentStacks.get("storage")));
        crossroads.addRoute('/storage/volume-importer/_/-/encrypted',
            () => this.volumeRoute.importEncrypted(this.currentStacks.get("storage")));
    }

    private loadSection(sectionId: string) {
        return this.sectionRoute.get(sectionId).then((stack) => {
            this.currentStacks.set(sectionId, stack);
        });
    }
}
