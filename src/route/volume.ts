import {VolumeRepository} from '../repository/volume-repository';
import {DiskRepository} from '../repository/disk-repository';
import {AbstractRoute} from './abstract-route';
import {Model} from '../model';
import * as _ from 'lodash';

export class VolumeRoute extends AbstractRoute {
    private static instance: VolumeRoute;

    private constructor(private volumeRepository: VolumeRepository,
                        private diskRepository: DiskRepository) {
        super();
    }

    public static getInstance() {
        if (!VolumeRoute.instance) {
            VolumeRoute.instance = new VolumeRoute(
                VolumeRepository.getInstance(),
                DiskRepository.getInstance()
            );
        }
        return VolumeRoute.instance;
    }

    public get(volumeId: string, stack: Array<any>) {
        let columnIndex = 1;
        return this.loadObjectInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            AbstractRoute.getObjectPathSuffix(Model.Volume, volumeId),
            Model.Volume,
            this.volumeRepository.listVolumes(),
            {id: volumeId}
        );
    }

    public topology(volumeId: string, stack: Array<any>) {
        let columnIndex = 2;
        return Promise.all([
            this.loadPropertyInColumn(
                stack,
                columnIndex,
                columnIndex - 1,
                '/topology',
                Model.ZfsTopology,
                'topology'
            ),
            this.volumeRepository.listVolumes()
        ]).spread((stack: Array<any>, volumes) => {
            _.last(stack).object._volume = _.find(volumes, {id: volumeId});
            _.last(stack).object._disks = this.diskRepository.listAvailableDisks();
            return stack;
        });
    }

    public topologyDisk(volumeId, diskId: string, stack: Array<any>) {
        let columnIndex = 3;
        return Promise.all([
            this.loadObjectInColumn(
                stack,
                columnIndex,
                columnIndex - 1,
                '/disk',
                Model.Disk,
                this.diskRepository.listDisks(),
                {id: diskId}
            ),
            this.volumeRepository.listVolumes()
        ]).spread((stack: Array<any>, volumes) => {
            _.last(stack).object._volume = _.find(volumes, {id: volumeId});
            return stack;
        });
    }

    public creatorDisk(diskId: string, stack: Array<any>) {
        let columnIndex = 2;
        return this.loadObjectInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/disk',
            Model.Disk,
            this.diskRepository.listDisks(),
            {id: diskId}
        );
    }

    public create(stack: Array<any>) {
        let columnIndex = 1;
        return this.loadObjectInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/create',
            Model.Volume,
            this.volumeRepository.getNewVolume()
        );
    }

    public import(stack: Array<any>) {
        let columnIndex = 1;
        return this.loadObjectInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            AbstractRoute.getObjectPathSuffix(Model.VolumeImporter, '-'),
            Model.VolumeImporter,
            this.volumeRepository.getVolumeImporter()
        );
    }

    public mediaImport(stack: Array<any>) {
        let columnIndex = 1;
        return this.loadObjectInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            AbstractRoute.getObjectPathSuffix(Model.VolumeMediaImporter, '-'),
            Model.VolumeMediaImporter,
            this.volumeRepository.getVolumeMediaImporter()
        );
    }

    public getDetachedVolume(volumeId: string, stack: Array<any>) {
        let columnIndex = 2;
        return this.loadObjectInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            AbstractRoute.getObjectPathSuffix(Model.DetachedVolume, volumeId),
            Model.DetachedVolume,
            this.volumeRepository.listDetachedVolumes(),
            {id: _.toString(volumeId)}
        );
    }

    public getDetachedVolumeTopology(stack: Array<any>) {
        let columnIndex = 3;
        return this.loadPropertyInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/topology',
            Model.ZfsTopology,
            'topology'
        ).then(stack => {
            _.last(stack).object._isDetached = true;
            return stack;
        });
    }

    public importEncrypted(stack: Array<any>) {
        let columnIndex = 2;
        return this.loadObjectInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/encrypted',
            Model.EncryptedVolumeImporter,
            this.volumeRepository.getEncryptedVolumeImporterInstance()
        );
    }

    public getEncryptedVolumeActions(volumeId: string, stack: Array<any>) {
        let columnIndex = 2;
        return this.loadObjectInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/encrypted-volume-actions',
            Model.EncryptedVolumeActions,
            this.volumeRepository.getEncryptedVolumeActionsForVolume(volumeId)
        );
    }
}

