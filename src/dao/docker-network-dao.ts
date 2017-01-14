import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DockerNetworkDao extends AbstractDao {
    public constructor() {
        super(Model.DockerNetwork, {
            eventName: 'entity-subscriber.docker.network.changed'
        });
    }

     public getNewInstance(): Promise<any> {
        let self = this,
            object = new Object({
            _isNew: true,
            _objectType: Model.DockerNetwork
            });

        //FIXME: needed because there is a bug in frb or collection
        //that doesn't changes in the select-multiple when this property is undefined.
        (object as any).containers = [];

        return Promise.resolve(object);
    }

}
