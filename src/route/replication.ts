import _ = require('lodash');
import {ReplicationRepository} from '../repository/replication-repository';
import {AbstractRoute} from './abstract-route';
import {Model} from '../model';
import {CalendarRepository} from '../repository/calendar-repository';

export class ReplicationRoute extends AbstractRoute {
    private static instance: ReplicationRoute;
    private objectType: string;

    private constructor(private replicationRepository: ReplicationRepository,
                        private calendarRepository: CalendarRepository) {
        super();
        this.objectType = Model.Replication;
    }

    public static getInstance() {
        if (!ReplicationRoute.instance) {
            ReplicationRoute.instance = new ReplicationRoute(
                ReplicationRepository.getInstance(),
                CalendarRepository.getInstance()
            );
        }
        return ReplicationRoute.instance;
    }

    public list(volumeId: string, stack: Array<any>) {
        let self = this,
            columnIndex = 2;
        return this.loadListInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/replication',
            Model.Replication,
            this.replicationRepository.listReplicationsForVolume(volumeId)
        );
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
            this.replicationRepository.getNewReplicationInstance(),
            this.modelDescriptorService.getUiDescriptorForType(objectType),
            this.replicationRepository.getHostUuid()
        ]).spread(function(replication, uiDescriptor, host) {
            context.object = replication;
            context.object.master = host;
            context.object.datasets = [{}];
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
            this.replicationRepository.getNewReplicationInstance(),
            this.modelDescriptorService.getUiDescriptorForType(objectType),
            this.replicationRepository.getHostUuid()
        ]).spread(function(replication, uiDescriptor, host) {
            context.object = replication;
            context.object.master = host;
            context.object.datasets = [{}];
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
            this.replicationRepository.listReplications(),
            this.modelDescriptorService.getUiDescriptorForType(objectType),
            this.calendarRepository.listTasks()
        ]).spread(function(replication, uiDescriptor, calendarTasks) {
            context.object = _.find(replication, {id: replicationId});
            context.object._calendarTask = _.find(calendarTasks, function(calendarTask) {
                return calendarTask['args'][0] === context.object.id;
            });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }
}

