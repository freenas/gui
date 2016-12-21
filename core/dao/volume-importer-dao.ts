import { AbstractDao } from './abstract-dao-ng';

export class VolumeImporterDao extends AbstractDao {
    private entries: Array<any>;

    public constructor() {
        super('VolumeImporter');
    }

    public list(): Promise<Array<any>> {
        let self = this;
        return this.entries ?
            Promise.resolve(this.entries) :
            this.getNewInstance().then(function(volumeImporter) {
                volumeImporter._isNew = false;
                volumeImporter.id = '-';
                self.entries = [volumeImporter];
                self.entries._objectType = 'VolumeImporter';
                return self.entries;
            });
    }
}
