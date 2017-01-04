"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var service_repository_1 = require("../repository/service-repository");
var ServicesCategoryDao = (function (_super) {
    __extends(ServicesCategoryDao, _super);
    function ServicesCategoryDao() {
        return _super.call(this, model_1.Model.ServicesCategory) || this;
    }
    ServicesCategoryDao.prototype.list = function () {
        return service_repository_1.ServiceRepository.getInstance().listServicesCategories();
    };
    return ServicesCategoryDao;
}(abstract_dao_1.AbstractDao));
exports.ServicesCategoryDao = ServicesCategoryDao;
