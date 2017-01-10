"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var DockerCollectionDao = (function (_super) {
    __extends(DockerCollectionDao, _super);
    function DockerCollectionDao() {
        return _super.call(this, model_1.Model.DockerCollection, {
            eventName: 'entity-subscriber.docker.collection.changed'
        }) || this;
    }
    DockerCollectionDao.prototype.getImages = function (collection) {
        return this.middlewareClient.callRpcMethod('docker.collection.get_entries', [collection.id]);
    };
    return DockerCollectionDao;
}(abstract_dao_1.AbstractDao));
exports.DockerCollectionDao = DockerCollectionDao;
