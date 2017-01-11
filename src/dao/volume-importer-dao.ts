import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import Promise = require("bluebird");

export class VolumeImporterDao extends AbstractDao {
    private entries: Array<any>;

    public constructor() {
        super(Model.VolumeImporter);
    }

    public list(): Promise<Array<any>> {
        let self = this;
        return this.entries ?
            Promise.resolve(this.entries) :
            this.getNewInstance().then(function(volumeImporter) {
                volumeImporter._isNew = false;
                volumeImporter.id = '-';
                self.entries = [volumeImporter];
                (self.entries as any)._objectType = Model.VolumeImporter;
                return self.entries;
            });
    }
}
