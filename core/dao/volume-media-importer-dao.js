"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var VolumeMediaImporterDao = (function (_super) {
    __extends(VolumeMediaImporterDao, _super);
    function VolumeMediaImporterDao() {
        return _super.call(this, 'VolumeMediaImporter') || this;
    }
    VolumeMediaImporterDao.prototype.list = function () {
        var self = this;
        return this.entries ?
            Promise.resolve(this.entries) :
            this.getNewInstance().then(function (volumeMediaImporter) {
                volumeMediaImporter._isNew = false;
                volumeMediaImporter.id = '-';
                self.entries = [volumeMediaImporter];
                self.entries._objectType = 'VolumeMediaImporter';
                return self.entries;
            });
    };
    return VolumeMediaImporterDao;
}(abstract_dao_1.AbstractDao));
exports.VolumeMediaImporterDao = VolumeMediaImporterDao;
