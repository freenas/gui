"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var Promise = require("bluebird");
var SectionSettingsDao = (function (_super) {
    __extends(SectionSettingsDao, _super);
    function SectionSettingsDao() {
        _super.call(this, 'SectionSettings');
    }
    SectionSettingsDao.prototype.list = function () {
        return Promise.resolve(SectionSettingsDao.entries);
    };
    SectionSettingsDao.prototype.getNewInstance = function () {
        return abstract_dao_ng_1.AbstractDao.prototype.getNewInstance.call(this).then(function (instance) {
            SectionSettingsDao.entries.push(instance);
            return instance;
        });
    };
    SectionSettingsDao.entries = [];
    return SectionSettingsDao;
}(abstract_dao_ng_1.AbstractDao));
exports.SectionSettingsDao = SectionSettingsDao;
