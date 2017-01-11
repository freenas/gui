import { AbstractDao } from './abstract-dao';

export class VolumeMediaImporterDao extends AbstractDao {
    private entries: Array<any>;

    public constructor() {
        super('VolumeMediaImporter');
    }

    public list(): Promise<Array<any>> {
        let self = this;
        return this.entries ?
            Promise.resolve(this.entries) :
            this.getNewInstance().then(function(volumeMediaImporter) {
                volumeMediaImporter._isNew = false;
                volumeMediaImporter.id = '-';
                self.entries = [volumeMediaImporter];
                self.entries._objectType = 'VolumeMediaImporter';
                return self.entries;
            });
    }
}
