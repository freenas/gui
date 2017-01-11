import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DebugDao extends AbstractDao {
    public constructor() {
        super(Model.Debug);
    }


    public collect(filename: string) {
        return this.middlewareClient.submitTaskWithDownload('debug.collect', [filename]);
    }
}
