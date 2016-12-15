import {AbstractDao} from "./abstract-dao-ng";
export class NetworkConfigDao extends AbstractDao {
    public constructor() {
        super('NetworkConfig', {
            queryMethod: 'network.config.get_config'
        });
    }

    public getMyIps() {
        return this.middlewareClient.callRpcMethod('network.config.get_my_ips');
    }
}
