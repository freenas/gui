import {AbstractDao} from "./abstract-dao-ng";

export class DebugDao extends AbstractDao {
    public constructor() {
        super('Debug');
    }


    public collect(filename: string) {
        return this.middlewareClient.submitTaskWithDownload('debug.collect', [filename]);
    }
}
