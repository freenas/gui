import { AbstractRepository } from './abstract-repository-ng';
import { ShellDao } from 'core/dao/shell-dao';

export class ShellRepository extends AbstractRepository {
    private static instance: ShellRepository;
    private shells: Array<string>;

    private constructor(private shellDao: ShellDao) {
        super();
    }

    public static getInstance() {
        if (!ShellRepository.instance) {
            ShellRepository.instance = new ShellRepository(
                ShellDao.getInstance()            );
        }
        return ShellRepository.instance;
    }

    public listShells(): Promise<Array<Object>> {
        let self = this;
        return this.shells ? Promise.resolve(this.shells) : this.shellDao.list().then((shells) => self.shells = shells);
    }

    public spawn(columns?: number, lines?: number) {
        columns = columns || 80;
        lines = lines || 24;
        return this.shellDao.spawn(columns, lines);
    }
}
