import {AbstractDao} from "./abstract-dao-ng";

export class IpmiDao extends AbstractDao {
    public constructor() {
        super('Ipmi');
    }

    public isIpmiLoaded() {
        return this.middlewareClient.callRpcMethod('ipmi.is_ipmi_loaded');
    }
}
