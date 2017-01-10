"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_model_repository_1 = require("./abstract-model-repository");
var model_1 = require("../model");
var DockerCollectionRepository = (function (_super) {
    __extends(DockerCollectionRepository, _super);
    function DockerCollectionRepository() {
        return _super.call(this, model_1.Model.DockerCollection) || this;
    }
    DockerCollectionRepository.getInstance = function () {
        if (!DockerCollectionRepository.instance) {
            DockerCollectionRepository.instance = new DockerCollectionRepository();
        }
        return DockerCollectionRepository.instance;
    };
    return DockerCollectionRepository;
}(abstract_model_repository_1.AbstractModelRepository));
exports.DockerCollectionRepository = DockerCollectionRepository;
