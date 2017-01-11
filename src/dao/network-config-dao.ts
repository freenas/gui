import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
export class NetworkConfigDao extends AbstractDao {
    public constructor() {
        super(Model.NetworkConfig, {
            queryMethod: 'network.config.get_config'
        });
    }

    public getMyIps() {
        return this.middlewareClient.callRpcMethod('network.config.get_my_ips');
    }
}
