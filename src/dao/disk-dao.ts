import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {Disk} from '../model/Disk';

export class DiskDao extends AbstractDao<Disk> {

    public constructor() {
        super(Model.Disk);
    }

    public erase(disk: Disk) {
        return this.middlewareClient.submitTask('disk.erase', [disk.id]);
    }
}


