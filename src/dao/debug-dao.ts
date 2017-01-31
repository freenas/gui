import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {Debug} from '../model/Debug';

export class DebugDao extends AbstractDao<Debug> {
    public constructor() {
        super(Model.Debug);
    }


    public collect(filename: string) {
        return this.middlewareClient.submitTaskWithDownload('debug.collect', [filename]);
    }
}
