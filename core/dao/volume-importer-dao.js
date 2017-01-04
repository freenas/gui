"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var Promise = require("bluebird");
var VolumeImporterDao = (function (_super) {
    __extends(VolumeImporterDao, _super);
    function VolumeImporterDao() {
        return _super.call(this, model_1.Model.VolumeImporter) || this;
    }
    VolumeImporterDao.prototype.list = function () {
        var self = this;
        return this.entries ?
            Promise.resolve(this.entries) :
            this.getNewInstance().then(function (volumeImporter) {
                volumeImporter._isNew = false;
                volumeImporter.id = '-';
                self.entries = [volumeImporter];
                self.entries._objectType = model_1.Model.VolumeImporter;
                return self.entries;
            });
    };
    return VolumeImporterDao;
}(abstract_dao_1.AbstractDao));
exports.VolumeImporterDao = VolumeImporterDao;
