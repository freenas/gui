"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var VolumeVdevRecommendationsDao = (function (_super) {
    __extends(VolumeVdevRecommendationsDao, _super);
    function VolumeVdevRecommendationsDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.VolumeVdevRecommendations, {
            queryMethod: 'volume.vdev_recommendations'
        }) || this;
    }
    VolumeVdevRecommendationsDao.getInstance = function () {
        if (!VolumeVdevRecommendationsDao.instance) {
            VolumeVdevRecommendationsDao.instance = new VolumeVdevRecommendationsDao();
        }
        return VolumeVdevRecommendationsDao.instance;
    };
    return VolumeVdevRecommendationsDao;
}(abstract_dao_ng_1.AbstractDao));
exports.VolumeVdevRecommendationsDao = VolumeVdevRecommendationsDao;
