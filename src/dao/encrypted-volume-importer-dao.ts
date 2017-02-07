import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {EncryptedVolumeImporter} from '../model/EncryptedVolumeImporter';

export class EncryptedVolumeImporterDao extends AbstractDao<EncryptedVolumeImporter> {

    public constructor() {
        super(Model.EncryptedVolumeImporter);
    }

}
