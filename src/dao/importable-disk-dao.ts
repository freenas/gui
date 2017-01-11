import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class ImportableDiskDao extends AbstractDao {

    public constructor() {
        super(Model.ImportableDisk, {
            queryMethod: 'volume.find_media'
        });
    }

}

