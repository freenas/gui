"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var VolumeSnapshotDao = (function (_super) {
    __extends(VolumeSnapshotDao, _super);
    function VolumeSnapshotDao() {
        return _super.call(this, model_1.Model.VolumeSnapshot, {
            eventName: 'entity-subscriber.volume.snapshot.changed'
        }) || this;
    }
    return VolumeSnapshotDao;
}(abstract_dao_1.AbstractDao));
exports.VolumeSnapshotDao = VolumeSnapshotDao;
