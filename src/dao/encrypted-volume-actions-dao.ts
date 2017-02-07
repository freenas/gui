import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {EncryptedVolumeActions} from '../model/EncryptedVolumeActions';

export class EncryptedVolumeActionsDao extends AbstractDao<EncryptedVolumeActions> {

    public constructor() {
        super(Model.EncryptedVolumeActions);
    }

}

