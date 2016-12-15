import {AbstractDao} from "./abstract-dao-ng";
export class DatabaseDao extends AbstractDao {
    public constructor() {
        super('Database')
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
