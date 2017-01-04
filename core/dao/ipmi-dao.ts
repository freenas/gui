import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class IpmiDao extends AbstractDao {
    public constructor() {
        super(Model.Ipmi);
    }

    public isIpmiLoaded() {
        return this.middlewareClient.callRpcMethod('ipmi.is_ipmi_loaded');
    }
}
