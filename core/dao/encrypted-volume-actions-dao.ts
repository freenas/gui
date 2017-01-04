import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class EncryptedVolumeActionsDao extends AbstractDao {

    public constructor() {
        super(Model.EncryptedVolumeActions);
    }

}

