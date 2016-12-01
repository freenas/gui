"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var systemSections = require("core/data/system-sections.json");
var SystemSectionDao = (function (_super) {
    __extends(SystemSectionDao, _super);
    function SystemSectionDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.SystemSection) || this;
    }
    SystemSectionDao.getInstance = function () {
        if (!SystemSectionDao.instance) {
            SystemSectionDao.instance = new SystemSectionDao();
        }
        return SystemSectionDao.instance;
    };
    SystemSectionDao.prototype.list = function () {
        var self = this;
        return Promise.all(systemSections.map(function (definition, index) {
            return self.getNewInstance().then(function (systemSection) {
                systemSection._isNew = false;
                systemSection.identifier = definition.id;
                systemSection.label = definition.label;
                systemSection.icon = definition.icon;
                systemSection.order = index;
                return systemSection;
            });
        }));
    };
    return SystemSectionDao;
}(abstract_dao_ng_1.AbstractDao));
exports.SystemSectionDao = SystemSectionDao;
