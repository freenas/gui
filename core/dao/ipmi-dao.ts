import {AbstractDao} from "./abstract-dao";

export class IpmiDao extends AbstractDao {
    public constructor() {
        super('Ipmi');
    }

    public isIpmiLoaded() {
        return this.middlewareClient.callRpcMethod('ipmi.is_ipmi_loaded');
    }
}
