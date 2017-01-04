"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_model_repository_1 = require("./abstract-model-repository");
var model_1 = require("../model");
var DockerContainerRepository = (function (_super) {
    __extends(DockerContainerRepository, _super);
    function DockerContainerRepository() {
        return _super.call(this, model_1.Model.DockerContainer) || this;
    }
    DockerContainerRepository.getInstance = function () {
        if (!DockerContainerRepository.instance) {
            DockerContainerRepository.instance = new DockerContainerRepository();
        }
        return DockerContainerRepository.instance;
    };
    return DockerContainerRepository;
}(abstract_model_repository_1.AbstractModelRepository));
exports.DockerContainerRepository = DockerContainerRepository;
