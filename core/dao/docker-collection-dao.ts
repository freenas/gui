import {AbstractDao} from "./abstract-dao";

export class DockerCollectionDao extends AbstractDao {
    public constructor() {
        super('DockerCollection');
    }

    public getImages (collection) {
        return this.middlewareClient.callRpcMethod("docker.collection.get_entries", [collection.id]);
    }
}
