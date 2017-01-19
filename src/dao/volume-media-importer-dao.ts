import { AbstractDao } from './abstract-dao';

export class VolumeMediaImporterDao extends AbstractDao {
    private volumeMediaImporter: Array<any>;

    public constructor() {
        super('VolumeMediaImporter');
    }

    public get(): Promise<Array<any>> {
        return this.volumeMediaImporter ?
            Promise.resolve(this.volumeMediaImporter) :
            this.getNewInstance().then((volumeMediaImporter) => {
                volumeMediaImporter._isNew = false;
                volumeMediaImporter.id = '-';
                return this.volumeMediaImporter = volumeMediaImporter;
            });
    }
}
