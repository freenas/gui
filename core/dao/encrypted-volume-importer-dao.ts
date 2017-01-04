import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class EncryptedVolumeImporterDao extends AbstractDao {

    public constructor() {
        super(Model.EncryptedVolumeImporter);
    }

}
