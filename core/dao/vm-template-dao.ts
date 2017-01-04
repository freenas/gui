import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class VmTemplateDao extends AbstractDao {

    public constructor() {
        super(Model.Vm, {
            queryMethod: 'vm.template.query'
        });
    }

}
