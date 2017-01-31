import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {VmConfig} from '../model/VmConfig';

export class VmConfigDao extends AbstractDao<VmConfig> {
    public constructor() {
        super(Model.VmConfig, {
            queryMethod: 'vm.config.get_config'
        });
    }
}
