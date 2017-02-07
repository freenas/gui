import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {Database} from '../model/Database';
export class DatabaseDao extends AbstractDao<Database> {
    public constructor() {
        super(Model.Database)
    }

    public dump(filename: string) {
        return this.middlewareClient.submitTaskWithDownload('database.dump', [filename]);
    }

    public factoryRestore() {
        return this.middlewareClient.submitTask('database.factory_restore');
    }

    public restore(file: File) {
        return this.middlewareClient.submitTaskWithUpload('database.restore', [null], file);
    }
}
