import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class VmTemplateDao extends AbstractDao {

    public constructor() {
        super(Model.VmTemplate, {
            queryMethod: 'vm.template.query'
        });
    }

}
