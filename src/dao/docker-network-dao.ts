import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import * as _ from 'lodash';
import {DockerNetwork} from '../model/DockerNetwork';

export class DockerNetworkDao extends AbstractDao<DockerNetwork> {
    public constructor() {
        super(Model.DockerNetwork, {
            eventName: 'entity-subscriber.docker.network.changed'
        });
    }

    public getNewInstance(): Promise<any> {
        // FIXME: needed because there is a bug in frb or collection
        // that doesn't changes in the select-multiple when this property is undefined.
        return super.getNewInstance().then(dockerNetwork => _.assign(dockerNetwork, {containers: []}));
    }

    public connect(networkId: string, containersIds: Array<string>) {
        return this.middlewareClient.submitTask('docker.network.connect', [containersIds, networkId]);
    }

    public disconnect(networkId: string, containersIds: Array<string>) {
        return this.middlewareClient.submitTask('docker.network.disconnect', [containersIds, networkId]);
    }
}
