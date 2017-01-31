import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {ImportableDisk} from '../model/ImportableDisk';

export class ImportableDiskDao extends AbstractDao<ImportableDisk> {

    public constructor() {
        super(Model.ImportableDisk, {
            queryMethod: 'volume.find_media'
        });
    }

}

