"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var DatabaseDao = (function (_super) {
    __extends(DatabaseDao, _super);
    function DatabaseDao() {
        _super.call(this, 'Database');
    }
    DatabaseDao.prototype.dump = function (filename) {
        return this.middlewareClient.submitTaskWithDownload('database.dump', [filename]);
    };
    DatabaseDao.prototype.factoryRestore = function () {
        return this.middlewareClient.submitTask('database.factory_restore');
    };
    DatabaseDao.prototype.restore = function (file) {
        return this.middlewareClient.submitTaskWithUpload('database.restore', [null], file);
    };
    return DatabaseDao;
}(abstract_dao_ng_1.AbstractDao));
exports.DatabaseDao = DatabaseDao;
