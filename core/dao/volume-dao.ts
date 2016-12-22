import { AbstractDao } from './abstract-dao-ng';
import * as Promise from "bluebird";

export class VolumeDao extends AbstractDao {

    public constructor() {
        super('Volume');
    }

    public getDisksAllocation(diskIds: Array<string>): Promise<Array<Object>> {
        return this.middlewareClient.callRpcMethod('volume.get_disks_allocation', [diskIds]);
    }

    public getAvailableDisks(): Promise<Array<string>> {
        return this.middlewareClient.callRpcMethod('volume.get_available_disks');
    }

    public export(volume: any) {
        return this.middlewareClient.submitTask('volume.export', [volume.id]);
    }

    public lock(volume: any) {
        return this.middlewareClient.submitTask('volume.lock', [volume.id]);
    }

    public unlock(volume: any, password?: string) {
        return this.middlewareClient.submitTask('volume.unlock', [volume.id, password]);
    }

    public rekey(volume: any, key: boolean, password?: string) {
        return this.middlewareClient.submitTask('volume.rekey', [volume.id, !!key, password])
    }

    public getVolumeKey(volume: any) {
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

    public scrub(volume: any) {
        return this.middlewareClient.submitTask('volume.scrub', [volume.id]);
    }

    public findMedia() {
        return this.middlewareClient.callRpcMethod('volume.find_media');
    }

    public importDisk(disk: string, path: string, fsType: string) {
        return this.middlewareClient.submitTask('volume.import_disk', [disk, path, fsType]);
    }
}



