import { AbstractDao } from './abstract-dao';

export class ShellDao extends AbstractDao {

    public constructor() {
        super({});
    }

    public list(): Promise<Array<any>> {
        return this.middlewareClient.callRpcMethod('shell.get_shells');
    }

    public spawn(columns: number, lines: number) {
        return this.middlewareClient.callRpcMethod('shell.spawn', ['/usr/local/bin/cli', columns, lines]);
    }
}

