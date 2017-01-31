import { AbstractDao } from './abstract-dao';
import {VolumeMediaImporter} from '../model/VolumeMediaImporter';

export class VolumeMediaImporterDao extends AbstractDao<VolumeMediaImporter> {
    private volumeMediaImporter: VolumeMediaImporter;

    public constructor() {
        super('VolumeMediaImporter');
    }

    public get(): Promise<VolumeMediaImporter> {
        return this.volumeMediaImporter ?
            Promise.resolve(this.volumeMediaImporter) :
            this.getNewInstance().then((volumeMediaImporter) => {
                volumeMediaImporter._isNew = false;
                volumeMediaImporter.id = '-';
                return this.volumeMediaImporter = volumeMediaImporter;
            });
    }
}
