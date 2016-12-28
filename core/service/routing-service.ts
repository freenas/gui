import * as _ from "lodash";
import * as crossroads from "crossroads";
import {ModelDescriptorService} from "./model-descriptor-service";
import {MiddlewareClient} from "./middleware-client";
import hasher = require("hasher");
import {SectionRoute} from "../route/section";
import {VolumeRoute} from "../route/volume";
import {ShareRoute} from "../route/share";
import {SnapshotRoute} from "../route/snapshot";
import {DatasetRoute} from "../route/dataset";
import {EventDispatcherService} from "./event-dispatcher-service";

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
                        private datasetRoute: DatasetRoute) {
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
                DatasetRoute.getInstance()
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
        this.currentStacks = new Map();

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


        crossroads.addRoute('/accounts', () => this.loadSection('accounts'));
    }

    private loadSection(sectionDescriptor: string) {
        return this.sectionRoute.get(sectionDescriptor).then((stack) => {
            this.currentStacks.set(sectionDescriptor, stack);
        });
    }
}
