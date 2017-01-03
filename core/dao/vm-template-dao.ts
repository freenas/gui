import { AbstractDao } from './abstract-dao';

export class VmTemplateDao extends AbstractDao {

    public constructor() {
        super('Vm', {
            queryMethod: 'vm.template.query'
        });
    }

}
