import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VmConfigDao extends AbstractDao {
    public constructor() {
        super(Model.VmConfig, {
            queryMethod: 'vm.config.get_config'
        });
    }
}
