"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require('./abstract-dao');
var _ = require("lodash");
var VmwareDatastoreDao = (function (_super) {
    __extends(VmwareDatastoreDao, _super);
    function VmwareDatastoreDao() {
        _super.call(this, 'VmwareDatastore');
    }
    VmwareDatastoreDao.prototype.list = function (peer) {
        return this.middlewareClient.callRpcMethod('vmware.get_datastores', [
            peer.credentials.address,
            peer.credentials.username,
            peer.credentials.password,
            false
        ]).then(function (datastores) { return _.forEach(datastores, function (datastore) { return datastore._objectType = 'VmwareDatastore'; }); });
    };
    return VmwareDatastoreDao;
}(abstract_dao_1.AbstractDao));
exports.VmwareDatastoreDao = VmwareDatastoreDao;
