import { AbstractDao } from './abstract-dao-ng';

export class ShellDao extends AbstractDao {
    private static instance: ShellDao;

    private constructor() {
        super({}, {
            queryMethod: 'shell.get_shells'
        });
    }

    public static getInstance() {
        if (!ShellDao.instance) {
            ShellDao.instance = new ShellDao();
        }
        return ShellDao.instance;
    }

    public spawn(columns: number, lines: number) {
        return this.middlewareClient.callRpcMethod('shell.spawn', ['/usr/local/bin/cli', columns, lines]);
    }
}

