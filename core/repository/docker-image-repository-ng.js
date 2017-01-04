"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_model_repository_1 = require("./abstract-model-repository");
var model_1 = require("../model");
var DockerImageRepository = (function (_super) {
    __extends(DockerImageRepository, _super);
    function DockerImageRepository() {
        return _super.call(this, model_1.Model.DockerImage) || this;
    }
    DockerImageRepository.getInstance = function () {
        if (!DockerImageRepository.instance) {
            DockerImageRepository.instance = new DockerImageRepository();
        }
        return DockerImageRepository.instance;
    };
    return DockerImageRepository;
}(abstract_model_repository_1.AbstractModelRepository));
exports.DockerImageRepository = DockerImageRepository;
