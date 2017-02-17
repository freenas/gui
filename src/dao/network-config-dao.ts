import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {NetworkConfig} from '../model/NetworkConfig';
export class NetworkConfigDao extends AbstractDao<NetworkConfig> {
    public constructor() {
        super(Model.NetworkConfig, {
            queryMethod: 'network.config.get_config'
        });
    }

    public getMyIps() {
        return this.middlewareClient.callRpcMethod('network.config.get_my_ips');
    }

    public getClientInterface(): Promise<string> {
        return this.middlewareClient.callRpcMethod('network.config.get_client_interface');
    }
}
