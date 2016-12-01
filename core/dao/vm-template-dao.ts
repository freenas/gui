import { AbstractDao } from './abstract-dao-ng';

export class VmTemplateDao extends AbstractDao {
    private static instance: VmTemplateDao;

    private constructor() {
        super(AbstractDao.Model.Vm, {
            queryMethod: 'vm.template.query'
        });
    }

    public static getInstance() {
        if (!VmTemplateDao.instance) {
            VmTemplateDao.instance = new VmTemplateDao();
        }
        return VmTemplateDao.instance;
    }
}
