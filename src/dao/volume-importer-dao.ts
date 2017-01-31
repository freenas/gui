import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {Model} from '../model';
import {VolumeImporter} from '../model/VolumeImporter';
import * as _ from 'lodash';

export class VolumeImporterDao extends AbstractDao<VolumeImporter> {
    private volumeImporter: VolumeImporter;

    public constructor() {
        super(Model.VolumeImporter);
    }

    public get(): Promise<VolumeImporter> {
        return this.volumeImporter ?
            Promise.resolve(this.volumeImporter) :
            this.getNewInstance().then(volumeImporter => this.volumeImporter = (_.assign(volumeImporter, {_isNew: false, id: '-'}) as VolumeImporter));
    }
}
