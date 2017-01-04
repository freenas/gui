"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var Promise = require("bluebird");
var SectionSettingsDao = (function (_super) {
    __extends(SectionSettingsDao, _super);
    function SectionSettingsDao() {
        return _super.call(this, model_1.Model.SectionSettings) || this;
    }
    SectionSettingsDao.prototype.list = function () {
        return Promise.resolve(SectionSettingsDao.entries);
    };
    SectionSettingsDao.prototype.getNewInstance = function () {
        return abstract_dao_1.AbstractDao.prototype.getNewInstance.call(this).then(function (instance) {
            SectionSettingsDao.entries.push(instance);
            return instance;
        });
    };
    return SectionSettingsDao;
}(abstract_dao_1.AbstractDao));
SectionSettingsDao.entries = [];
exports.SectionSettingsDao = SectionSettingsDao;
