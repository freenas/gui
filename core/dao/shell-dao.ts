import { AbstractDao } from './abstract-dao-ng';

export class ShellDao extends AbstractDao {

    public constructor() {
        super({}, {
            queryMethod: 'shell.get_shells'
        });
    }

    public spawn(columns: number, lines: number) {
        return this.middlewareClient.callRpcMethod('shell.spawn', ['/usr/local/bin/cli', columns, lines]);
    }
}

