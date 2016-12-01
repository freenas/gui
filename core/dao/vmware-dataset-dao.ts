import { AbstractDao } from './abstract-dao-ng';

export class VmwareDatasetDao extends AbstractDao {
    private static instance: VmwareDatasetDao;

    private constructor() {
        super(AbstractDao.Model.VmwareDataset);
    }

    public static getInstance() {
        if (!VmwareDatasetDao.instance) {
            VmwareDatasetDao.instance = new VmwareDatasetDao();
        }
        return VmwareDatasetDao.instance;
    }
}
