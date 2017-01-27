import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class VolumeImporterDao extends AbstractDao {
    private volumeImporter: Array<any>;

    public constructor() {
        super(Model.VolumeImporter);
    }

    public get(): Promise<any> {
        return this.volumeImporter ?
            Promise.resolve(this.volumeImporter) :
            this.getNewInstance().then((volumeImporter) => {
                volumeImporter._isNew = false;
                volumeImporter.id = '-';
                return this.volumeImporter = volumeImporter;
            });
    }
}
