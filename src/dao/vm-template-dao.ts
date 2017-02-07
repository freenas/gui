import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {VmTemplate} from '../model/VmTemplate';

export class VmTemplateDao extends AbstractDao<VmTemplate> {

    public constructor() {
        super(Model.VmTemplate, {
            queryMethod: 'vm.template.query',
            idPath: 'template.name'
        });
    }

}
