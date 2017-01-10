"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_model_repository_1 = require("./abstract-model-repository");
var model_1 = require("../model");
var DockerHostRepository = (function (_super) {
    __extends(DockerHostRepository, _super);
    function DockerHostRepository() {
        return _super.call(this, model_1.Model.DockerHost) || this;
    }
    DockerHostRepository.getInstance = function () {
        if (!DockerHostRepository.instance) {
            DockerHostRepository.instance = new DockerHostRepository();
        }
        return DockerHostRepository.instance;
    };
    return DockerHostRepository;
}(abstract_model_repository_1.AbstractModelRepository));
exports.DockerHostRepository = DockerHostRepository;
