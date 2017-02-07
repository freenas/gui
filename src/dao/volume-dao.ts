import { AbstractDao } from './abstract-dao';
import {Volume} from '../model/Volume';
import {ZfsVdev} from '../model/ZfsVdev';

export class VolumeDao extends AbstractDao<Volume> {

    public constructor() {
        super(Volume.getClassName());
    }

    public getDisksAllocation(diskIds: Array<string>): Promise<Array<Object>> {
        return this.middlewareClient.callRpcMethod('volume.get_disks_allocation', [diskIds]);
    }

    public getAvailableDisks(): Promise<Array<string>> {
        return this.middlewareClient.callRpcMethod('volume.get_available_disks');
    }

    public export(volume: Volume) {
        return this.middlewareClient.submitTask('volume.export', [volume.id]);
    }

    public lock(volume: Volume) {
        return this.middlewareClient.submitTask('volume.lock', [volume.id]);
    }

    public unlock(volume: Volume, password?: string) {
        return this.middlewareClient.submitTask('volume.unlock', [volume.id, password]);
    }

    public rekey(volume: Volume, key: boolean, password?: string) {
        return this.middlewareClient.submitTask('volume.rekey', [volume.id, !!key, password]);
    }

    public getVolumeKey(volume: Volume) {
        return this.middlewareClient.submitTaskWithDownload('volume.keys.backup', [volume.id, 'key_' + volume.id]);
    }

    public importEncrypted(name: string, disks: Array<any>, key: string, password: string) {
        return this.middlewareClient.submitTask('volume.import', [
            name,
            name,
            {},
            {
                key: key,
                disks: disks.map((x) => x.path)
            },
            password
        ]);
    }

    public scrub(volume: Volume) {
        return this.middlewareClient.submitTask('volume.scrub', [volume.id]);
    }

    public upgrade(volume: Volume) {
        return this.middlewareClient.submitTask('volume.upgrade', [volume.id]);
    }

    public findMedia() {
        return this.middlewareClient.callRpcMethod('volume.find_media');
    }

    public importDisk(disk: string, path: string, fsType: string) {
        return this.middlewareClient.submitTask('volume.import_disk', [disk, path, fsType]);
    }

    public offlineVdev(volumeId: string, vdev: ZfsVdev) {
        return this.middlewareClient.submitTask('zfs.pool.offline_disk', [volumeId, vdev.guid]);
    }

    public onlineVdev(volumeId: string, vdev: ZfsVdev) {
        return this.middlewareClient.submitTask('zfs.pool.online_disk', [volumeId, vdev.guid]);
    }

    public importShares(volumeId: string) {
        return this.middlewareClient.submitTask('volume.autoimport', [volumeId, 'shares']);
    }
}



