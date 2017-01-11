import {ReplicationRepository} from "../repository/replication-repository";

export class ReplicationService {
    private static instance: ReplicationService;

    public constructor(private replicationRepository: ReplicationRepository) {}

    public static getInstance(): ReplicationService {
        if (!ReplicationService.instance) {
            ReplicationService.instance = new ReplicationService(
                ReplicationRepository.getInstance()
            );
        }
        return ReplicationService.instance;
    }

    public listReplications(): Array<any> {
        return this.replicationRepository.listReplications();
    }

    public extractTransportOptions(replication) {
        let result = {},
            length = replication.transportOptions ? replication.transportOptions.length || Object.keys(replication.transportOptions).length : 0,
            option, i;

        for (i = 0; i < length; i++) {
            option = replication.transportOptions[i];
            if (option["%type"] === "compress-replication-transport-plugin") {
                result.compress = option.level;
            } else if (option["%type"] === "encrypt-replication-transport-plugin") {
                result.encrypt = option.type;
            } else if (option["%type"] === "throttle-replication-transport-plugin") {
                result.throttle = option.buffer_size;
            }
        }

        return result;
    }

    public setTransportOptions(replication, options) {
        let transportOptions = [];

        if (options.encrypt) {
            transportOptions.push({
                "%type": "encrypt-replication-transport-plugin",
                type: options.encrypt
            });
        }
        if (options.compress) {
            transportOptions.push({
                "%type": "compress-replication-transport-plugin",
                level: options.compress
            });
        }
        if (options.throttle) {
            transportOptions.push({
                "%type": "throttle-replication-transport-plugin",
                buffer_size: options.throttle
            });
        }

        replication.transportOptions = transportOptions;
    }
}
