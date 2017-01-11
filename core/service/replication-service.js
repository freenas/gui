"use strict";
var replication_repository_1 = require("../repository/replication-repository");
var ReplicationService = (function () {
    function ReplicationService(replicationRepository) {
        this.replicationRepository = replicationRepository;
    }
    ReplicationService.getInstance = function () {
        if (!ReplicationService.instance) {
            ReplicationService.instance = new ReplicationService(replication_repository_1.ReplicationRepository.getInstance());
        }
        return ReplicationService.instance;
    };
    ReplicationService.prototype.listReplications = function () {
        return this.replicationRepository.listReplications();
    };
    ReplicationService.prototype.extractTransportOptions = function (replication) {
        var result = {}, length = replication.transportOptions ? replication.transportOptions.length || Object.keys(replication.transportOptions).length : 0, option, i;
        for (i = 0; i < length; i++) {
            option = replication.transportOptions[i];
            if (option["%type"] === "compress-replication-transport-plugin") {
                result.compress = option.level;
            }
            else if (option["%type"] === "encrypt-replication-transport-plugin") {
                result.encrypt = option.type;
            }
            else if (option["%type"] === "throttle-replication-transport-plugin") {
                result.throttle = option.buffer_size;
            }
        }
        return result;
    };
    ReplicationService.prototype.setTransportOptions = function (replication, options) {
        var transportOptions = [];
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
    };
    return ReplicationService;
}());
exports.ReplicationService = ReplicationService;
