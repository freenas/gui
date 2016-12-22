import {AbstractDao} from "./abstract-dao-ng";

export class VmConfigDao extends AbstractDao {
    public constructor() {
        super('VmConfig', {
            queryMethod: 'vm.config.get_config'
        });
    }
}
