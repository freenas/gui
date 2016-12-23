import {AbstractDao} from "./abstract-dao-ng";

export class DockerImageDao extends AbstractDao {
    public constructor() {
        super('DockerImage');
    }

    public pullToHost(image: string, dockerHostId: string) {
        return this.middlewareClient.callRpcMethod("docker.image.pull", [image, dockerHostId]);
    }

    public deleteFromHost(image: string, dockerHostId: string) {
        return this.middlewareClient.callRpcMethod("docker.image.delete", [image, dockerHostId]);
    }
}
