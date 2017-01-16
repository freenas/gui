import {VolumeRepository} from '../repository/volume-repository';
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from '../service/model-descriptor-service';
import _ = require("lodash");
import Promise = require("bluebird");
import {ReplicationService} from "../service/replication-service";
import {AbstractRoute} from "./abstract-route";
import {Model} from "../model";

export class ReplicationRoute extends AbstractRoute {
    private static instance: ReplicationRoute;
    private objectType: string;

    private constructor(private replicationService: ReplicationService,
                        private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService) {
        super(eventDispatcherService);
        this.objectType = Model.Replication;
    }

    public static getInstance() {
        if (!ReplicationRoute.instance) {
            ReplicationRoute.instance = new ReplicationRoute(
                ReplicationService.getInstance(),
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance()
            );
        }
        return ReplicationRoute.instance;
    }

    public list(volumeId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Replication,
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/replication'
            };
        return Promise.all([
            this.replicationService.listReplicationsForVolume(volumeId),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(replications, uiDescriptor) {
            replications._objectType = objectType;
            context.object = replications;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public create(volumeId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Replication,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create',
                volume: volumeId
            };
        return Promise.all([
            this.replicationService.getNewReplicationInstance(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(replication, uiDescriptor) {
            context.object = replication;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public createForDataset(datasetId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Replication,
            columnIndex = 4,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/replication',
                dataset: datasetId
            };
        return Promise.all([
            this.replicationService.getNewReplicationInstance(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(replication, uiDescriptor) {
            context.object = replication;
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public get(replicationId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Replication,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: this.objectType,
                parentContext: parentContext,
                path: parentContext.path + '/_/' + encodeURIComponent(replicationId)
            };
        return Promise.all([
            this.replicationService.listReplications(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(replication, uiDescriptor) {
            context.object = _.find(replication, {id: replicationId});
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }
}

