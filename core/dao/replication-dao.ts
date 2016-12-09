import { AbstractDao } from './abstract-dao-ng';

export class ReplicationDao extends AbstractDao {
    private static instance: ReplicationDao;

    private constructor() {
        super(AbstractDao.Model.Replication);
    }

    public static getInstance() {
        if (!ReplicationDao.instance) {
            ReplicationDao.instance = new ReplicationDao();
        }
        return ReplicationDao.instance;
    }

    public replicateDataset(dataset: Object, replicationOptions: Object, transportOptions: Array<Object>) {
        return this.middlewareClient.submitTask('replication.replicate_dataset', [dataset, replicationOptions, transportOptions]);
    }
}


