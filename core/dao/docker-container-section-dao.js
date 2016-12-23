"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var DockerContainerSectionDao = (function (_super) {
    __extends(DockerContainerSectionDao, _super);
    function DockerContainerSectionDao() {
        _super.call(this, 'DockerContainerSectionDao');
    }
    return DockerContainerSectionDao;
}(abstract_dao_ng_1.AbstractDao));
exports.DockerContainerSectionDao = DockerContainerSectionDao;
