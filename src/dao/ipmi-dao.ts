import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {Ipmi} from '../model/Ipmi';

export class IpmiDao extends AbstractDao<Ipmi> {
    public constructor() {
        super(Model.Ipmi);
    }

    public isIpmiLoaded() {
        return this.middlewareClient.callRpcMethod('ipmi.is_ipmi_loaded');
    }
}
