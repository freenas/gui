import { AbstractDao } from './abstract-dao';
import * as _ from 'lodash';
import {Model} from '../model';
import {VmwareDatastore} from '../model/VmwareDatastore';

export class VmwareDatastoreDao extends AbstractDao<VmwareDatastore> {

    public constructor() {
        super(Model.VmwareDatastore);
    }

    public listDatastoresOnPeer(peer: any): Promise<Array<any>> {
        let results = [];
        return this.middlewareClient.callRpcMethod('vmware.get_datastores', [
            peer.credentials.address,
            peer.credentials.username,
            peer.credentials.password.$password,
            false
        ]).then((response) => {
            results = response.args.fragment;
            return _.forEach(this.handleNextFragment(response.id, response.args.seqno, results), result => result._objectType = 'VmwareDatastore');
        });
    }

    private handleNextFragment(streamId: string, seqno: number, results: Array<any>): Array<any> {
        this.middlewareClient.continueRpcMethod(streamId, seqno).then((response) => {
            if (response.args.fragment) {
                results = results.concat(response.args.fragment);
                results = this.handleNextFragment(response.id, response.args.seqno, results);
            }
        });
        return results;
    }

}

