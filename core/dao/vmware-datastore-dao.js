"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var VmwareDatastoreDao = (function (_super) {
    __extends(VmwareDatastoreDao, _super);
    function VmwareDatastoreDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.VmwareDatastore, {
            queryMethod: 'vmware.get_datastore'
        }) || this;
    }
    VmwareDatastoreDao.getInstance = function () {
        if (!VmwareDatastoreDao.instance) {
            VmwareDatastoreDao.instance = new VmwareDatastoreDao();
        }
        return VmwareDatastoreDao.instance;
    };
    return VmwareDatastoreDao;
}(abstract_dao_ng_1.AbstractDao));
exports.VmwareDatastoreDao = VmwareDatastoreDao;
