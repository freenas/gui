import { AbstractDao } from './abstract-dao-ng';

export class VmTemplateDao extends AbstractDao {

    public constructor() {
        super('Vm', {
            queryMethod: 'vm.template.query'
        });
    }

}
